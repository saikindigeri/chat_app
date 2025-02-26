import { FiUsers, FiUserPlus, FiX, FiMenu, FiLogOut } from "react-icons/fi";

const Sidebar = ({ isOpen, toggleSidebar,onSelect }) => {
    return (
      <div
        className={`bg-gray-800 text-white h-full transition-all duration-300 ${
          isOpen ? "w-60" : "w-16"
        }`}
      >
        <button className="p-4 text-xl" onClick={toggleSidebar}>
          {isOpen ? "<<" : ">>"}
        </button>

        <ul className="space-y-4">
          <li className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-700 rounded-md transition" onClick={() => onSelect("Friends")}>
            <FiUsers className="text-xl flex-shrink-0" /> {isOpen && "Friends"}
          </li>
          <li className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-700 rounded-md transition" onClick={() => onSelect("Requests")}>
            <FiUserPlus className="text-xl flex-shrink-0" /> {isOpen && "Requests"}
          </li>
          <li className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-700 rounded-md transition" onClick={() => onSelect("Users")}>
            <FiUsers className="text-xl flex-shrink-0" /> {isOpen && "Users"}
          </li>
        </ul>
      </div>
    );
  };
  
  export default Sidebar;
  