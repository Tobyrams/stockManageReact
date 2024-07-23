import { Drawer } from "vaul";

function DrawerComponent() {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <button className="z-[0] btn font-medium">Profile</button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className=" flex flex-col rounded-t-[10px] h-[50%] mt-24 fixed bottom-0 left-0 right-0">
          <div className="p-4 bg-base-100 rounded-t-[10px] flex-1">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-500 mb-8" />
            <div className="max-w-md mx-auto">
              <Drawer.Title className="font-medium mb-4">
                Drawer Title
              </Drawer.Title>
              <p>Your drawer content goes here.</p>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export default DrawerComponent;
