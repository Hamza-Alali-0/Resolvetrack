'use client';
import React, { useState, useEffect, ChangeEvent } from "react";
import { TbProgressAlert } from "react-icons/tb";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { FaPrint } from "react-icons/fa";
import { getSession } from "next-auth/react";
import { AiFillCheckCircle, AiOutlineClose, AiOutlineHourglass } from 'react-icons/ai';
import StatisticsUser from "./statisticsuser";

export interface Reclamation {
  _id: string;
  email: string;
  type: string;
  models: string;
  reference: string;
  message: string;
  etat: 'en attente' | 'probleme resolu' | 'probleme non resolu';
  date: string;  // Added date field
  image?: string;
}

const ReclamationList: React.FC = () => {
  const [reclamations, setReclamations] = useState<Reclamation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchType, setSearchType] = useState<string>("");
  const [searchReference, setSearchReference] = useState<string>("");
  const [searchEmail, setSearchEmail] = useState<string>("");
  const [searchDate, setSearchDate] = useState<string>(""); 
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserReclamations = async () => {
      const session = await getSession();

      if (!session?.user) {
        console.error("User is not authenticated.");
        return;
      }

      try {
        const response = await fetch('/api/reclamations/listereclamations');
        if (!response.ok) {
          throw new Error("Failed to fetch reclamations");
        }
        const data = await response.json();
        setReclamations(
          data.filter((reclamation: Reclamation) => reclamation.email === session?.user?.email)
        );
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserReclamations();
  }, []);

  const handleSearchTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchType(e.target.value);
  };

  const handleSearchReferenceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchReference(e.target.value);
  };

  const handleSearchDateChange = (e: ChangeEvent<HTMLInputElement>) => { // New handler for date filter
    setSearchDate(e.target.value);
  };

  const filteredReclamations = reclamations.filter((reclamation: Reclamation) => {
    const typeMatch = reclamation.type.toLowerCase().includes(searchType.toLowerCase());
    const referenceMatch = reclamation.reference.toLowerCase().includes(searchReference.toLowerCase());
    const emailMatch = reclamation.email.toLowerCase().includes(searchEmail.toLowerCase());
    const dateMatch = !searchDate || new Date(reclamation.date).toLocaleDateString() === new Date(searchDate).toLocaleDateString(); 
    return typeMatch && referenceMatch && emailMatch && dateMatch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const printReclamation = (reclamation: Reclamation) => {
    const printWindow = window.open('', '', 'height=600,width=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Imprimer Reclamation</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .check { border: 1px solid #000; padding: 20px; border-radius: 5px; }
              .check-header { font-size: 24px; text-align: center; margin-bottom: 20px; }
              .check-content { margin-bottom: 20px; }
              .check-content div { margin-bottom: 10px; }
              .check-footer { text-align: center; font-size: 18px; }
            </style>
          </head>
          <body>
            <div class="check">
              <div class="check-header">
                Reclamation 
              </div>
              <div class="check-content">
                <div><strong>Email:</strong> ${reclamation.email}</div>
                <div><strong>Type:</strong> ${reclamation.type}</div>
                <div><strong>Model:</strong> ${reclamation.models}</div>
                <div><strong>Reference:</strong> ${reclamation.reference}</div>
                <div><strong>Description:</strong> ${reclamation.message}</div>
                <div><strong>Etat:</strong> ${reclamation.etat}</div>
                <div><strong>Date:</strong> ${new Date(reclamation.date).toLocaleDateString()}</div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <div className="p-6 space-y-6 bg-gray-100 rounded-lg shadow-lg">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="border-2 border-yellow-600 rounded-full w-12 h-12 flex items-center justify-center mr-2 bg-yellow-100">
            <TbProgressAlert className="text-3xl text-yellow-600" />
          </div>
          <h3 className="text-3xl font-semibold text-gray-800">Historique des Reclamations</h3>
        </div>
      </div>

      <StatisticsUser />
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Chercher par Type..."
          value={searchType}
          onChange={handleSearchTypeChange}
          className="px-4 py-2 rounded-lg border-gray-300 shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white"
        />
        <input
          type="text"
          placeholder="Chercher par Reference..."
          value={searchReference}
          onChange={handleSearchReferenceChange}
          className="px-4 py-2 rounded-lg border-gray-300 shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white"
        />
        <input
          type="text"
          placeholder="Chercher par Email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="px-4 py-2 rounded-lg border-gray-300 shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white"
        />
         <input
          type="date"
          placeholder="Chercher par Date..."
          value={searchDate}
          onChange={handleSearchDateChange}
          className="px-4 py-2 rounded-lg border-gray-300 shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg">
          <thead className="bg-yellow-200 border-b border-gray-300">
            <tr>
              <th className="px-6 py-4 text-left text-gray-600">Statut</th>
              <th className="px-6 py-4 text-left text-gray-600">Type</th>
              <th className="px-6 py-4 text-left text-gray-600">Modele</th>
              <th className="px-6 py-4 text-left text-gray-600">Reference</th>
              <th className="px-6 py-4 text-left text-gray-600">Details</th>
              <th className="px-6 py-4 text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReclamations.map((reclamation) => (
              <React.Fragment key={reclamation._id}>
                <tr className={`border-b hover:bg-gray-100 transition-colors duration-300 ${expandedId === reclamation._id ? 'bg-gray-50' : ''}`} onClick={() => toggleExpand(reclamation._id)}>
                  <td className="px-6 py-4">
                    {reclamation.etat === "probleme resolu" ? (
                      <AiFillCheckCircle className="text-green-600 text-2xl" />
                    ) : reclamation.etat === "probleme non resolu" ? (
                      <AiOutlineClose className="text-red-600 text-2xl" />
                    ) : (
                      <AiOutlineHourglass className="text-yellow-600 text-2xl" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-800">{reclamation.type}</td>
                  <td className="px-6 py-4 text-gray-800">{reclamation.models}</td>
                  <td className="px-6 py-4 text-gray-800">{reclamation.reference}</td>
                  <td className="px-6 py-4 text-gray-800 text-center">
                    <button className="p-2 rounded-full hover:bg-gray-200" onClick={() => toggleExpand(reclamation._id)}>
                      {expandedId === reclamation._id ? <AiOutlineArrowUp className="text-gray-600 text-2xl" /> : <AiOutlineArrowDown className="text-gray-600 text-2xl" />}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-gray-800 text-center">
                    <button className="p-2 rounded-full hover:bg-gray-200" onClick={(e) => { e.stopPropagation(); printReclamation(reclamation); }}>
                      <FaPrint className="text-gray-600 text-xl" />
                    </button>
                  </td>
                </tr>
                {expandedId === reclamation._id && (
                  <tr className="bg-gray-50">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="flex justify-center items-center mb-4">
                     
                      </div>
                      <div className="space-y-2">
                       
                        <div>
                          <strong>Message:</strong> {reclamation.message}
                        </div>
                        <div>
                          <strong>Etat:</strong> {reclamation.etat}
                        </div>
                        <div>
                          <strong>Date:</strong> {new Date(reclamation.date).toLocaleDateString()} {/* Displaying the date */}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReclamationList;
