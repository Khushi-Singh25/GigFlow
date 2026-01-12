const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { IndianRupee, Clock, User, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

const GigDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidMessage, setBidMessage] = useState('');
  const [bidPrice, setBidPrice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGigDetails();
  }, [id]);

  useEffect(() => {
    if (gig && user && gig.ownerId._id === user._id) {
      fetchBids();
    }
  }, [gig, user]);

  const fetchGigDetails = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/gigs/${id}`);
      setGig(data);
    } catch (error) {
      toast.error('Failed to load gig details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/bids/${id}`);
      setBids(data);
    } catch (error) {
      console.error('Failed to load bids');
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/bids`, {
        gigId: id,
        message: bidMessage,
        price: bidPrice,
      });
      toast.success('Bid submitted successfully');
      setBidMessage('');
      setBidPrice('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit bid');
    }
  };

  const handleHire = async (bidId) => {
    if (!window.confirm('Are you sure you want to hire this freelancer? This action cannot be undone.')) return;
    
    try {
      await axios.patch(`${API_URL}/api/bids/${bidId}/hire`);
      toast.success('Freelancer hired successfully!');
      fetchGigDetails();
      fetchBids();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to hire freelancer');
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-400">Loading...</div>;
  if (!gig) return <div className="text-center py-20 text-slate-400">Gig not found</div>;

  const isOwner = user && gig.ownerId._id === user._id;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => navigate(-1)} 
        className="text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-6 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Gigs
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card p-8">
            <div className="flex justify-between items-start mb-4">
               <h1 className="text-3xl font-bold text-slate-900 leading-tight">{gig.title}</h1>
            </div>
             <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    gig.status === 'open' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}>
                    {gig.status.toUpperCase()}
                </span>
                <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Posted {new Date(gig.createdAt).toLocaleDateString()}
                </span>
            </div>

            <div className="prose prose-slate max-w-none text-slate-600">
                <h3 className="text-slate-900 font-semibold mb-2">Description</h3>
                <p className="whitespace-pre-wrap">{gig.description}</p>
            </div>
          </div>

          {/* Bid Form for Freelancers */}
          {!isOwner && gig.status === 'open' && (
             <div className="card p-8 border-indigo-100 shadow-md">
                {user ? (
                    <>
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Submit a Proposal</h3>
                        <form onSubmit={handleBidSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Your Price (₹)</label>
                                <input
                                    type="number"
                                    required
                                    className="input-field"
                                    value={bidPrice}
                                    onChange={(e) => setBidPrice(e.target.value)}
                                    placeholder="e.g. 500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Cover Letter</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="input-field"
                                    value={bidMessage}
                                    onChange={(e) => setBidMessage(e.target.value)}
                                    placeholder="Why are you the best fit for this gig?"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full btn btn-primary"
                            >
                                Send Proposal
                            </button>
                        </form>
                    </>
                ) : (
                     <div className="text-center">
                        <p className="text-slate-600 mb-4">Log in to bid on this gig.</p>
                        <button onClick={() => navigate('/login')} className="w-full btn btn-primary">
                            Login to Bid
                        </button>
                    </div>
                )}
             </div>
          )}

          {/* Bids Section for Owner */}
          {isOwner && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Received Bids 
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-sm">{bids.length}</span>
              </h2>
              
              {bids.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-slate-500">
                      No bids received yet.
                  </div>
              ) : (
                <div className="grid gap-4">
                    {bids.map((bid) => (
                        <div key={bid._id} className={`bg-white rounded-lg border shadow-sm p-6 transition-all ${
                            bid.status === 'hired' ? 'border-green-500 ring-1 ring-green-500 bg-green-50/10' : 'border-slate-200'
                        }`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                                    {bid.freelancerId.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">{bid.freelancerId.name}</h3>
                                    <p className="text-xs text-slate-500">{bid.freelancerId.email}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-xl font-bold text-slate-900">₹{bid.price}</span>
                                <span className={`text-xs font-bold uppercase ${
                                    bid.status === 'hired' ? 'text-green-600' : 
                                    bid.status === 'rejected' ? 'text-red-500' : 'text-slate-400'
                                }`}>
                                    {bid.status}
                                </span>
                            </div>
                        </div>
                        
                        <div className="bg-slate-50 p-4 rounded-md text-slate-700 text-sm mb-4">
                            {bid.message}
                        </div>
                        
                        {gig.status === 'open' && bid.status === 'pending' && (
                            <div className="flex justify-end pt-2 border-t border-slate-100">
                                <button
                                onClick={() => handleHire(bid._id)}
                                className="btn bg-green-600 hover:bg-green-700 text-white gap-2"
                                >
                                <CheckCircle className="h-4 w-4" />
                                Hire Freelancer
                                </button>
                            </div>
                        )}
                        </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Gig Overview</h3>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-slate-600">Budget</span>
                    <span className="font-bold text-slate-900 text-lg">₹{gig.budget.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-slate-600">Client</span>
                    <div className="flex items-center gap-2">
                         <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                            {gig.ownerId.name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-900">{gig.ownerId.name}</span>
                    </div>
                </div>
                 <div className="flex items-center justify-between">
                    <span className="text-slate-600">Status</span>
                    <span className={`font-semibold ${gig.status === 'open' ? 'text-green-600' : 'text-indigo-600'}`}>
                        {gig.status.toUpperCase()}
                    </span>
                </div>
            </div>
          </div>
          
          {!isOwner && gig.status !== 'open' && (
              <div className="card p-6 bg-slate-50 border-slate-200 text-center">
                  <h3 className="text-lg font-bold text-slate-700 mb-2">Gig Closed</h3>
                  <p className="text-slate-500 text-sm">This gig has been assigned to a freelancer.</p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GigDetails;
