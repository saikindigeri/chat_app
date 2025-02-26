import { useState } from "react";
import Sidebar from "../sections/Sidebar";
import Friends from "../sections/Friends"
import Requests from "../sections/Requests"
import Users from "../sections/Users"

const Home = () => {
    const [selected, setSelected] = useState("Friends");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

 

  return (
    <div className="flex w-full h-screen fixed">
      {/* Sidebar */}
      <Sidebar onSelect={setSelected} isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 p-6 space-y-4 ${
          isSidebarOpen ? "w-[calc(100%-15rem)]" : "w-[calc(100%-4rem)]"
        }`}
      >
        <h1 className="text-3xl font-bold">Main Content</h1>
        <p>
          This is some dummy text to fill the main content area. When the sidebar shrinks,
          this content expands, and when the sidebar expands, this content shrinks.
        </p>

        {/* Components Rendering */}
        {selected === "Friends" && <Friends  />}
          {selected === "Requests" && <Requests/>}
          {selected === "Users" && <Users />}
      </div>
    </div>
  );
};

export default Home;
