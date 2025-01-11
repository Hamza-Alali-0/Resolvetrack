import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactStars from 'react-stars';
import toast from 'react-hot-toast';

interface Rating {
  _id: string;
  email: string;
  stars: number;
  message: string;
  date: string;
}

const Testimonials2: React.FC = () => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get('/api/testimonials');
        setRatings(response.data);
      } catch (err) {
        setError('Error fetching ratings');
        toast.error('Error fetching ratings');
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-900">What Our Users Say</h2>
      <div className="space-y-4">
        {ratings.length ? (
          ratings.map((rating) => (
            <div key={rating._id} className="p-4 border border-gray-200 rounded-md shadow-sm">
              <div className="flex items-center mb-2">
                <ReactStars
                  count={5}
                  size={20}
                  color2={'#ffd700'}
                  value={rating.stars}
                  edit={false}
                />
              </div>
              <div className="text-gray-800 font-medium"><strong>{rating.email}</strong></div>
              <p className="text-gray-600 mb-2">{rating.message}</p>
              <p className="text-sm text-gray-500">Posted on {new Date(rating.date).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Pas de Notes disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default Testimonials2;
