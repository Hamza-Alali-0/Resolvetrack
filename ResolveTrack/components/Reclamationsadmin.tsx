'use client';
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TbProgressAlert } from "react-icons/tb";
import { AiOutlineCheck, AiOutlineHourglass,AiOutlineEdit, AiOutlineDelete, AiOutlineArrowDown, AiOutlineArrowUp, AiFillCheckCircle, AiOutlineClose } from "react-icons/ai";
import toast from "react-hot-toast";
import Statistics from "./Statistics";

export interface Reclamation {
  _id: string;
  email: string;
  type: string;
  models: string;
  reference: string;
  message: string;
  date: string;
  etat: 'en attente' | 'probleme resolu' | 'probleme non resolu';
  image?: string; // Optional field for image URL
}

const ReclamationList: React.FC = () => {
  const [reclamations, setReclamations] = useState<Reclamation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchType, setSearchType] = useState<string>("");
  const [searchReference, setSearchReference] = useState<string>("");
  const [searchEmail, setSearchEmail] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null); // To track expanded rows
  const [editReclamation, setEditReclamation] = useState<Reclamation | null>(null); // Track the reclamation being edited
  const [newEtat, setNewEtat] = useState<'en attente' | 'probleme resolu' | 'probleme non resolu'>('en attente'); // State for new etat value
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchReclamations = async () => {
      try {
        const response = await fetch('/api/reclamations/listereclamations');
        if (!response.ok) {
          throw new Error("Failed to fetch reclamations");
        }
        const data = await response.json();
        setReclamations(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchReclamations();
  }, []);
  const formatDate = (dateInput: Date | string | null): string => {
    if (!dateInput) return 'N/A';
    const dateString = dateInput instanceof Date ? dateInput.toISOString() : dateInput;
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const handleEdit = (reclamation: Reclamation) => {
    setEditReclamation(reclamation);
    setNewEtat(reclamation.etat);
  };

  const handleValidate = (reclamationId: string) => {
    updateEtat(reclamationId, 'probleme resolu');
  };

  const handleDelete = (reclamationId: string) => {
    updateEtat(reclamationId, 'probleme non resolu');
  };

  const updateEtat = async (reclamationId: string, newEtat: 'en attente' | 'probleme resolu' | 'probleme non resolu') => {
    try {
      const response = await fetch(`/api/reclamations/updateetat/${reclamationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newetat: newEtat }),
      });

      if (response.ok) {
        setReclamations(reclamations.map(reclamation =>
          reclamation._id === reclamationId ? { ...reclamation, etat: newEtat } : reclamation
        ));
        toast.success(`Reclamation updated to ${newEtat}`);
        setEditReclamation(null); // Close the form after successful update
      } else {
        const errorText = await response.text();
        console.error('Error Response:', errorText);
        throw new Error(errorText || 'Failed to update reclamation');
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editReclamation) {
      updateEtat(editReclamation._id, newEtat);
    }
  };

  const handleSearchTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchType(e.target.value);
  };

  const handleSearchReferenceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchReference(e.target.value);
  };

  const handleSearchEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchEmail(e.target.value);
  };

  const filteredReclamations = reclamations.filter((reclamation: Reclamation) => {
    const typeMatch = reclamation.type.toLowerCase().includes(searchType.toLowerCase());
    const referenceMatch = reclamation.reference.toLowerCase().includes(searchReference.toLowerCase());
    const emailMatch = reclamation.email.toLowerCase().includes(searchEmail.toLowerCase());
    return typeMatch && referenceMatch && emailMatch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
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
          <h3 className="text-3xl font-semibold text-gray-800">Liste des Reclamations</h3>
        </div>
      </div>
      <Statistics />

      {/* Search Inputs */}
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
          onChange={handleSearchEmailChange}
          className="px-4 py-2 rounded-lg border-gray-300 shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm bg-white"
        />
      </div>

      {/* Reclamation Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg">
          <thead className="bg-yellow-200 border-b border-gray-300">
            <tr>
              <th className="px-6 py-4 text-left text-gray-600">Status</th>
              <th className="px-6 py-4 text-left text-gray-600">Email</th>
              <th className="px-6 py-4 text-left text-gray-600">Type</th>
              <th className="px-6 py-4 text-left text-gray-600">Modele</th>
              <th className="px-6 py-4 text-left text-gray-600">Reference</th>
              <th className="px-6 py-4 text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReclamations.map((reclamation) => (
              <React.Fragment key={reclamation._id}>
                <tr className={`border-b hover:bg-gray-100 transition-colors duration-300 cursor-pointer ${expandedId === reclamation._id ? 'bg-gray-50' : ''}`} onClick={() => toggleExpand(reclamation._id)}>
                <td className="px-6 py-4">
      {reclamation.etat === "probleme resolu" ? (
        <AiFillCheckCircle className="text-green-600 text-2xl" />
      ) : reclamation.etat === "probleme non resolu" ? (
        <AiOutlineClose className="text-red-600 text-2xl" />
      ) : (
        <AiOutlineHourglass className="text-yellow-600 text-2xl" />
      )}
    </td>
                  <td className="px-6 py-4 text-gray-800">{reclamation.email}</td>
                  <td className="px-6 py-4 text-gray-800">{reclamation.type}</td>
                  <td className="px-6 py-4 text-gray-800">{reclamation.models}</td>
                  <td className="px-6 py-4 text-gray-800">{reclamation.reference}</td>
                  <td className="px-6 py-4 flex items-center space-x-2">
                    <button onClick={(e) => { e.stopPropagation(); handleValidate(reclamation._id); }} className="text-green-600 hover:bg-green-100 p-2 rounded-full transition-colors duration-300">
                      <AiOutlineCheck />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleEdit(reclamation); }} className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition-colors duration-300">
                      <AiOutlineEdit />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(reclamation._id); }} className="text-red-600 hover:bg-red-100 p-2 rounded-full transition-colors duration-300">
                      <AiOutlineDelete />
                    </button>
                    <button className="ml-2 p-2 rounded-full hover:bg-gray-200" onClick={() => toggleExpand(reclamation._id)}>
                      {expandedId === reclamation._id ? <AiOutlineArrowUp className="text-gray-600" /> : <AiOutlineArrowDown className="text-gray-600" />}
                    </button>
                  </td>
                </tr>
                {expandedId === reclamation._id && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 bg-gray-50 text-gray-700">
                      <p><strong>Reclamation:</strong> {reclamation.message}</p>
                      <p><strong>Etat:</strong> {reclamation.etat}</p>
                      <p><strong>Date:</strong> { formatDate(reclamation.date)}</p>
                      
                    </td>
                  </tr>  
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

    {/* Edit Form */}
{editReclamation && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">Repondre Reclamation</h3>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">Etat:</label>
          <input
            type="text"
            value={newEtat}
            onChange={(e) => setNewEtat(e.target.value as 'en attente' | 'probleme resolu' | 'probleme non resolu')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 transition duration-200 ease-in-out"
            placeholder="..."
          />
        </div>
        <div className="flex justify-end gap-4">
          <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 ease-in-out">Envoyer</button>
          <button type="button" onClick={() => setEditReclamation(null)} className="bg-gray-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-gray-700 transition duration-200 ease-in-out">Annuler</button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default ReclamationList;
