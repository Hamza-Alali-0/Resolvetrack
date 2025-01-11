import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactStars from 'react-stars';


interface Rating {
  _id: string;
  email: string;
  stars: number;
  message: string;
  date: string;
}

const Avgtestimonials: React.FC = () => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [averageStars, setAverageStars] = useState<number>(0);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get('/api/testimonials');
        const ratingsData = response.data;

        setRatings(ratingsData);

        // Calculate the average stars
        const totalStars = ratingsData.reduce((acc: number, rating: Rating) => acc + rating.stars, 0);
        const avgStars = ratingsData.length ? totalStars / ratingsData.length : 0;
        setAverageStars(avgStars);
      } catch (err) {
        setError('Error fetching ratings');
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Notes et témoignages
      </h2>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-center">Note moyenne</h3>
        <div className="flex justify-center items-center mb-4">
          <ReactStars
            count={5}
            size={40}
            color2={'#ffd700'}
            value={averageStars}
            edit={false}
          />
          <span className="ml-2 text-gray-700 text-xl">({averageStars.toFixed(1)})</span>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">Notes</h3>
        <div className="space-y-4">
          {ratings.length ? (
            ratings.map((rating) => (
              <div key={rating._id} className="p-4 border border-gray-300 rounded-md">
                <div className="flex items-center mb-2">
                  <ReactStars
                    count={5}
                    size={24}
                    color2={'#ffd700'}
                    value={rating.stars}
                    edit={false}
                  />
                  <span className="text-gray-700"> {rating.email}</span>
                </div>
                <p className="mb-2">{rating.message}</p>
                <p className="text-sm text-gray-500">Posted on {new Date(rating.date).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p>No ratings available.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Avgtestimonials;
