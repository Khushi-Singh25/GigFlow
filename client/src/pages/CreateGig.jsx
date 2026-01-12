const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreateGig = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/gigs`, {
        title,
        description,
        budget,
      });
      toast.success('Gig posted successfully');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post gig');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Post a New Gig</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
            <input
                type="text"
                required
                className="input-field"
                placeholder="e.g. Build a React Dashboard"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
                required
                rows={6}
                className="input-field"
                placeholder="Describe the project requirements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Budget (₹)</label>
            <input
                type="number"
                required
                className="input-field"
                placeholder="e.g. 1000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
            />
            </div>
            <div className="flex gap-4 pt-4">
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="flex-1 btn btn-secondary"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex-1 btn btn-primary"
                >
                    Post Gig
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGig;
