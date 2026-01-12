const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Clock, PlusCircle } from 'lucide-react';

const MyGigs = () => {
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    fetchMyGigs();
  }, []);

  const fetchMyGigs = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/gigs/my-gigs`);
      setGigs(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-2xl font-bold text-slate-900">My Gigs</h2>
            <p className="text-slate-500 mt-1">Manage your posted jobs and view applications.</p>
        </div>
        <Link to="/create-gig" className="btn btn-primary gap-2">
             <PlusCircle className="h-4 w-4" />
             Post New Gig
        </Link>
      </div>

      <div className="space-y-4">
        {gigs.map((gig) => (
          <div key={gig._id} className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-200 transition-colors group">
            <div>
               <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {gig.title}
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                        gig.status === 'open' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}>
                        {gig.status.toUpperCase()}
                    </span>
               </div>
               <p className="text-slate-500 text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Posted on {new Date(gig.createdAt).toLocaleDateString()}
               </p>
            </div>
            
            <div className="flex items-center gap-4">
                 <div className="text-right mr-4 hidden sm:block">
                    <span className="block text-sm font-medium text-slate-900">₹{gig.budget.toLocaleString()}</span>
                    <span className="text-xs text-slate-500">Budget</span>
                 </div>
                <Link
                to={`/gigs/${gig._id}`}
                className="btn btn-secondary w-full sm:w-auto"
                >
                View
                </Link>
            </div>
          </div>
        ))}
        
        {gigs.length === 0 && (
             <div className="text-center py-20 bg-white rounded-lg border border-dashed border-slate-300">
                <p className="text-slate-500 mb-4">You haven't posted any gigs yet.</p>
                <Link to="/create-gig" className="btn btn-primary">
                    Post your first gig
                </Link>
            </div>
        )}
      </div>
    </div>
  );
};

export default MyGigs;
