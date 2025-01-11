// components/Apropos.tsx
'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa';

interface ReclamationCounts {
  problemeResoluCount: number;
}

const Apropos: React.FC = () => {
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
    <div className="flex justify-center items-center p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center bg-green-100 p-4 rounded-lg shadow-md w-full max-w-md">
        <div className="w-16 h-16 bg-green-300 rounded-full flex items-center justify-center mr-4">
          <FaCheckCircle className="text-green-600 text-3xl" />
          <br />
        </div>
       
        <div>
          
          <h3 className="text-xl font-semibold"> Problemes resolus</h3>
          <p className="text-2xl">{counts?.problemeResoluCount}</p>
        </div>
      </div>
    </div>
  );
};

export default Apropos;
