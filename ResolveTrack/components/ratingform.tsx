import React, { useState, ChangeEvent, FormEvent } from 'react';
import ReactStars from 'react-stars';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface RatingFormProps {}

const RatingForm: React.FC<RatingFormProps> = () => {
  const { data: session } = useSession();
  const [stars, setStars] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleRatingChange = (newRating: number) => {
    setStars(newRating);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const email = session?.user?.email;
      if (!email) {
        throw new Error('User is not authenticated');
      }
      
      await axios.post('/api/rate', { email, stars, message });
      toast.success('Rating submitted successfully!');
      setStars(0);
      setMessage('');
    } catch (err) {
      toast.error('Error submitting rating. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <br /><br />
      <h2 className="text-2xl font-semibold mb-4">Notez l'interaction</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Étoiles:</label>
          <ReactStars
            count={5}
            size={40} // Increased size
            color2={'#ffd700'}
            value={stars}
            onChange={handleRatingChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Message:</label>
          <textarea
            id="message"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={message}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 font-bold text-white rounded-md ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
          }`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Envoyer'}
        </button>
      </form>
    </div>
  );
};

export default RatingForm;
