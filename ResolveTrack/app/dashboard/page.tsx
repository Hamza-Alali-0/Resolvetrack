"use client";
import React, { useState } from "react";
import UserPostList from "../../components/userpostlist";
import Navbar from "@/components/Navbar";
import SidebarUser from "../../components/SidebarUser";
import Listereclamationsuser from "@/components/reclamationsuser";
import RatingForm from "@/components/ratingform";

const YourComponent: React.FC = () => {
  const [currentSidebarItem, setCurrentSidebarItem] = useState("profile");

  const handleSidebarItemClick = (item: string) => {
    setCurrentSidebarItem(item);
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <SidebarUser onSidebarItemClick={handleSidebarItemClick} />
        <div className="flex-1 p-6 lg:px-8">
          {currentSidebarItem === "profile" && <UserPostList />}
          {currentSidebarItem === "rating" && <RatingForm />}
          {currentSidebarItem === "Listereclamations" && <Listereclamationsuser />}
        </div>
      </div>
    </>
  );
};

export default YourComponent;
