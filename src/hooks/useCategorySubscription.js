import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export function useCategorySubscription() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch initial categories
    fetchCategories();

    // Set up real-time subscription
    const channel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "categories" },
        (payload) => {
          // Handle real-time updates
          if (payload.eventType === "INSERT") {
            setCategories((prev) => [...prev, payload.new]);
          } else if (payload.eventType === "UPDATE") {
            setCategories((prev) =>
              prev.map((cat) => (cat.id === payload.new.id ? payload.new : cat))
            );
          } else if (payload.eventType === "DELETE") {
            setCategories((prev) =>
              prev.filter((cat) => cat.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");
    if (error) {
      console.error("Error fetching categories:", error);
    } else {
      setCategories(data);
    }
  };

  return { categories };
}
