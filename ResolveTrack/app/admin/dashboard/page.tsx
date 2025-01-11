// app/admin/dashboard/page.tsx
'use client';

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import AddMaterialForm from "@/components/AddmaterialForm"; // Corrected import
import MaterialList from "@/components/materialList"; // Corrected import
import ReclamationsAdmin from "@/components/Reclamationsadmin"; // Corrected import

const DashboardPage: React.FC = () => {
  const [currentSidebarItem, setCurrentSidebarItem] = useState("Material");

  const handleSidebarItemClick = (item: string) => {
    console.log(`Clicked ${item} in Sidebar`);
    setCurrentSidebarItem(item);
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl flex items-center justify-between p-6 lg:px-8">
        <div className="flex gap-x-6">
          <Sidebar onSidebarItemClick={handleSidebarItemClick} />
        </div>

        <div className="flex-1 px-4">
          {currentSidebarItem === "Reclamations" && <ReclamationsAdmin />}
          {currentSidebarItem === "Material" && <AddMaterialForm />}
          {currentSidebarItem === "Liste Materiel" && <MaterialList />}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
