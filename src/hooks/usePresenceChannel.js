import { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabaseClient';

export function usePresenceChannel(session) {
  const [onlineUsers, setOnlineUsers] = useState({});
  const channelRef = useRef(null);

  useEffect(() => {
    let channel;

    const setupChannel = () => {
      if (!session?.user?.id) return;

      channel = supabase.channel("online-users", {
        config: {
          presence: {
            key: session.user.id,
          },
        },
      });

      channel
        .on("presence", { event: "sync" }, () => {
          const newState = channel.presenceState();
          const onlineUsersMap = {};
          Object.values(newState)
            .flat()
            .forEach((user) => {
              // Only consider users with a valid session as online
              if (user.user_id && user.is_logged_in) {
                onlineUsersMap[user.user_id] = true;
              }
            });
          setOnlineUsers(onlineUsersMap);
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            await channel.track({
              user_id: session.user.id,
              email: session.user.email,
              is_logged_in: true, // Add this flag
            });
          }
        });

      channelRef.current = channel;
    };

    const cleanupChannel = () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
      setOnlineUsers({});
    };

    if (session?.user) {
      setupChannel();
    } else {
      cleanupChannel();
    }

    return () => {
      cleanupChannel();
    };
  }, [session]);

  return onlineUsers;
}