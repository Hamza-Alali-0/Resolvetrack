import React from "react";
import { HiClipboardList } from "react-icons/hi";
import { BsPlusCircleFill } from "react-icons/bs";
import { AiFillAlert } from "react-icons/ai";

interface SidebarProps {
  onSidebarItemClick: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSidebarItemClick }) => {
  return (
    <div className="fixed top-1/2 transform -translate-y-1/2 left-0 flex flex-col items-center justify-center w-48 bg-white dark:bg-slate-900 shadow-lg z-20">
      <nav className="p-4 w-full">
        <a
          href="#reclamations"
          className="flex flex-col items-center py-2 px-4 cursor-pointer rounded-md transition duration-300 hover:bg-gray-200 w-full text-center"
          onClick={() => onSidebarItemClick("Reclamations")}
        >
          <AiFillAlert className="text-yellow-600 text-2xl mb-1" />
          <span>Reclamations</span>
        </a>
        <a
          href="#material"
          className="flex flex-col items-center py-2 px-4 cursor-pointer rounded-md transition duration-300 hover:bg-gray-200 w-full text-center"
          onClick={() => onSidebarItemClick("Material")}
        >
          <BsPlusCircleFill className="text-yellow-600 text-2xl mb-1" />
          <span>Materiel</span>
        </a>
        <a
          href="#liste-materiel"
          className="flex flex-col items-center py-2 px-4 cursor-pointer rounded-md transition duration-300 hover:bg-gray-200 w-full text-center"
          onClick={() => onSidebarItemClick("Liste Materiel")}
        >
          <HiClipboardList className="text-yellow-600 text-2xl mb-1" />
          <span>Liste Materiel</span>
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;
