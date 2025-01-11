// components/Statistics.tsx
'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHourglassHalf, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

interface ReclamationCounts {
  etatEnAttenteCount: number;
  problemeNonResoluCount: number;
  problemeResoluCount: number;
}

const Statistics: React.FC = () => {
  const [counts, setCounts] = useState<ReclamationCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get('/api/statistics');
        setCounts(response.data);
      } catch (err) {
        setError('Failed to fetch reclamation counts.');
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <div className="flex items-center bg-yellow-100 p-4 rounded-lg shadow-md">
        <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center mr-4">
          <FaHourglassHalf className="text-yellow-600 text-2xl" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">En Attente</h3>
          <p className="text-xl">{counts?.etatEnAttenteCount}</p>
        </div>
      </div>
      
      <div className="flex items-center bg-red-100 p-4 rounded-lg shadow-md">
        <div className="w-12 h-12 bg-red-300 rounded-full flex items-center justify-center mr-4">
          <FaExclamationTriangle className="text-red-600 text-2xl" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Problème Non Résolu</h3>
          <p className="text-xl">{counts?.problemeNonResoluCount}</p>
        </div>
      </div>

      <div className="flex items-center bg-green-100 p-4 rounded-lg shadow-md">
        <div className="w-12 h-12 bg-green-300 rounded-full flex items-center justify-center mr-4">
          <FaCheckCircle className="text-green-600 text-2xl" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Problème Résolu</h3>
          <p className="text-xl">{counts?.problemeResoluCount}</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
