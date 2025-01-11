import React from "react";
import { ImProfile } from "react-icons/im";
import { AiFillAlert } from "react-icons/ai";
import { MdRateReview } from "react-icons/md";

interface SidebarProps {
  onSidebarItemClick: (item: string) => void;
}

const SidebarUser: React.FC<SidebarProps> = ({ onSidebarItemClick }) => {
  return (
    <div className="fixed top-1/2 transform -translate-y-1/2 left-0 flex flex-col items-center justify-center w-48 bg-white dark:bg-slate-900 shadow-lg z-20">
      <nav className="p-4 w-full">
        <a
          href="#dashboard"
          className="flex flex-col items-center py-2 px-4 cursor-pointer rounded-md transition duration-300 hover:bg-gray-200 w-full text-center"
          onClick={() => onSidebarItemClick("profile")}
        >
          <ImProfile className="text-yellow-600 text-2xl mb-1" />
          <span>Profile</span>
        </a>
        <a
          href="#liste-materiel"
          className="flex flex-col items-center py-2 px-4 cursor-pointer rounded-md transition duration-300 hover:bg-gray-200 w-full text-center"
          onClick={() => onSidebarItemClick("Listereclamations")}
        >
          <AiFillAlert className="text-yellow-600 text-2xl mb-1" />
          <span>Reclamations</span>
        </a>
        <a
          href="#rating"
          className="flex flex-col items-center py-2 px-4 cursor-pointer rounded-md transition duration-300 hover:bg-gray-200 w-full text-center"
          onClick={() => onSidebarItemClick("rating")}
        >
          <MdRateReview className="text-yellow-600 text-2xl mb-1" />
          <span>Rating</span>
        </a>
      </nav>
    </div>
  );
};

export default SidebarUser;
