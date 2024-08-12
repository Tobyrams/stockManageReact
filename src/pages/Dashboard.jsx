import React from "react";
import { DrawerComponent } from "../components";
import toast from "react-hot-toast";

function Dashboard() {
  return (
    <div className="p-10">
      {/* <h1 className="text-4xl">Dashboard</h1> */}
      <DrawerComponent />
    </div>
  );
}

export default Dashboard;
