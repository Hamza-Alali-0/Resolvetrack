'use client';
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import axios from 'axios'; 
import { useRouter } from "next/navigation";
import { FaUserEdit } from "react-icons/fa";

const EditProfile: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.put('/api/editprofile', {
        currentPassword,
        newPassword,
        email: session?.user?.email,
      });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error("Failed to change password. Please try again later.");
    }
  };

  return (
    <>
      {/* Back to Dashboard Button */}
      <button
        onClick={handleBackToDashboard}
        className="bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-4"
      >
        &lt; 
      </button>

      
          {/* Edit Profile Section */}
          <div style={{ textAlign: "center" }}>
          <h3 style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div
              style={{
                border: "2px solid black",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                display: "inline-block",
                lineHeight: "20px",
                marginBottom: "-42px",
                marginRight: "5px",
              }}
            ></div>
            <div
              style={{
                border: "2px solid black",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                display: "inline-block",
                lineHeight: "20px",
                marginBottom: "-2px",
                marginRight: "5px",
              }}
            ></div>
            <div
              style={{
                border: "2px solid black",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                display: "inline-block",
                lineHeight: "20px",
                marginBottom: "-42px",
                marginRight: "5px",
              }}
            ></div>
            <div><FaUserEdit className="text-6xl text-yellow-600 mt-4" /> </div>

            <div
              style={{
                border: "2px solid black",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                display: "inline-block",
                lineHeight: "20px",
                marginTop: "-30px",
                marginLeft: "5px",
              }}
            ></div>
            <div
              style={{
                border: "2px solid black",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                display: "inline-block",
                lineHeight: "20px",
                marginTop: "-2px",
                marginLeft: "5px",
              }}
            ></div>
            <div
              style={{
                border: "2px solid black",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                display: "inline-block",
                lineHeight: "20px",
                marginTop: "-30px",
                marginLeft: "5px",
              }}
            ></div>

          </h3>
          <h3>Editer Profile</h3>
        </div>
<br /><br />
          {/* Change Password Form */}
<form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
  <label className="block">
    <span className="text-gray-700">Mot de Passe Actuel:</span>
    <input
      type="password"
      value={currentPassword}
      onChange={(e) => setCurrentPassword(e.target.value)}
      className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      required
    />
  </label>

  <label className="block">
    <span className="text-gray-700">Nouveau Mot de passe</span>
    <input
      type="password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      required
    />
  </label>

  <label className="block">
    <span className="text-gray-700">Confirmer Mot de passe:</span>
    <input
      type="password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      required
    />
  </label>

  <button
    type="submit"
    className="bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 mx-auto"
    >
  Editer Mot de Passe
  </button>
</form>

        
    </>
  );
};

export default EditProfile;
