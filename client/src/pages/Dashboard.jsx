import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { LayoutGrid, Briefcase, CheckCircle, Clock, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [listData, setListData] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('active'); // 'active', 'bids', 'hired', 'completed'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData(currentFilter);
  }, [currentFilter]);

  const fetchDashboardData = async (filter) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/users/dashboard?filter=${filter}`);
      setStats(data.stats);
      setListData(data.listData);
    } catch (error) {
      console.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteJob = async (bidId) => {
      if(!window.confirm("Are you sure you want to mark this job as completed?")) return;

      try {
          await axios.patch(`${API_URL}/api/bids/${bidId}/complete`);
          toast.success("Job marked as completed!");
          fetchDashboardData(currentFilter); // Refresh data
      } catch (error) {
          toast.error(error.response?.data?.message || "Failed to update job status");
      }
  }

  const getFilterTitle = () => {
      switch(currentFilter) {
          case 'bids': return 'All Submitted Bids';
          case 'hired': return 'All Hired Gigs';
          case 'completed': return 'Completed Jobs';
          default: return 'Your Active Jobs';
      }
  }

  // Helper to render status badge
  const renderStatusBadge = (status) => {
      switch(status) {
          case 'hired': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200 uppercase">Hired</span>;
          case 'completed': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 uppercase">Completed</span>;
          case 'rejected': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200 uppercase">Rejected</span>;
          default: return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200 uppercase">Pending</span>;
      }
  }

  if (loading && !stats) return <div className="text-center py-20 text-slate-400">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of your freelance activity.</p>
      </div>

      {/* Stats Grid - Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <button 
            onClick={() => setCurrentFilter('bids')}
            className={`card p-6 border-l-4 border-indigo-500 text-left transition-all hover:shadow-md ${currentFilter === 'bids' ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500">Total Bids</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats?.bidsSubmitted || 0}</h3>
                </div>
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <Briefcase className="h-5 w-5" />
                </div>
            </div>
        </button>
        <button 
            onClick={() => setCurrentFilter('hired')}
            className={`card p-6 border-l-4 border-green-500 text-left transition-all hover:shadow-md ${currentFilter === 'hired' ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500">Gigs Hired</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats?.gigsHired || 0}</h3>
                </div>
                <div className="p-2 bg-green-50 rounded-lg text-green-600">
                    <Award className="h-5 w-5" />
                </div>
            </div>
        </button>
        <button 
            onClick={() => setCurrentFilter('active')}
            className={`card p-6 border-l-4 border-blue-500 text-left transition-all hover:shadow-md ${currentFilter === 'active' ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500">Active Jobs</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats?.currentlyAssigned || 0}</h3>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Clock className="h-5 w-5" />
                </div>
            </div>
        </button>
        <button 
            onClick={() => setCurrentFilter('completed')}
            className={`card p-6 border-l-4 border-slate-500 text-left transition-all hover:shadow-md ${currentFilter === 'completed' ? 'ring-2 ring-slate-500 ring-offset-2' : ''}`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500">Completed</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">{stats?.gigsCompleted || 0}</h3>
                </div>
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <CheckCircle className="h-5 w-5" />
                </div>
            </div>
        </button>
      </div>

      {/* Dynamic List Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900">{getFilterTitle()}</h2>
        
        {loading ? (
             <div className="text-center py-12">Loading list...</div>
        ) : listData.length === 0 ? (
             <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
                <p className="text-slate-500">No items found in this category.</p>
                <Link to="/" className="text-indigo-600 hover:underline mt-2 inline-block">
                    Browse open gigs
                </Link>
            </div>
        ) : (
            <div className="space-y-4">
                {listData.map((bid) => (
                    <div key={bid._id} className="card p-6 flex flex-col sm:flex-row justify-between items-center hover:border-indigo-200 transition-colors">
                        <div>
                             <h3 className="text-lg font-bold text-slate-900 mb-1">{bid.gigId?.title || 'Unknown Gig'}</h3>
                             <p className="text-sm text-slate-500">
                                {new Date(bid.updatedAt).toLocaleDateString()} • Budget: ₹{bid.gigId?.budget?.toLocaleString() || 0}
                             </p>
                        </div>
                        <div className="flex items-center gap-4 mt-4 sm:mt-0">
                             {renderStatusBadge(bid.status)}
                             
                             <Link to={`/gigs/${bid.gigId?._id}`} className="btn btn-secondary">
                                View Details
                             </Link>
                             
                             {bid.status === 'hired' && (
                                <button 
                                    onClick={() => handleCompleteJob(bid._id)}
                                    className="btn btn-primary bg-green-600 hover:bg-green-700 text-white gap-2"
                                >
                                    <CheckCircle className="h-4 w-4" />
                                    Mark Complete
                                </button>
                             )}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
