const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Filter, IndianRupee, Clock, ArrowUpRight } from 'lucide-react';

const Home = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [search, setSearch] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [sort, setSort] = useState('newest');
  const [status, setStatus] = useState('open'); // Default to 'open'
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchGigs();
    }, 300); // Debounce search

    return () => clearTimeout(delayDebounceFn);
  }, [search, minBudget, maxBudget, sort, status]);

  const fetchGigs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        ...(minBudget && { minBudget }),
        ...(maxBudget && { maxBudget }),
        sort,
        status
      });

      const { data } = await axios.get(`${API_URL}/api/gigs?${params}`);
      setGigs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Controls */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Browse Gigs</h1>
                <p className="text-slate-500 mt-1">Find the perfect project or freelancer.</p>
            </div>
            <div className="flex items-center gap-2">
                 <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`btn ${showFilters ? 'bg-slate-100 text-slate-900' : 'btn-secondary'}`}
                >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                </button>
            </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title..."
            className="input-field pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white rounded-lg border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-2">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Min Budget</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                <input
                  type="number"
                  className="input-field pl-7"
                  placeholder="0"
                  value={minBudget}
                  onChange={(e) => setMinBudget(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Max Budget</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                <input
                  type="number"
                  className="input-field pl-7"
                  placeholder="10000"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                />
              </div>
            </div>
            <div>
               <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
               <select 
                className="input-field"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
               >
                   <option value="open">Open</option>
                   <option value="assigned">Assigned</option>
                   <option value="">All</option>
               </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Sort By</label>
              <select
                className="input-field"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="budget_asc">Budget (Low to High)</option>
                <option value="budget_desc">Budget (High to Low)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading gigs...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {gigs.map((gig) => (
            <Link
              key={gig._id}
              to={`/gigs/${gig._id}`}
              className="card group hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden hover:border-indigo-200"
            >
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                        gig.status === 'open' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                        {gig.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(gig.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {gig.title}
                </h3>
                <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                    {gig.description}
                </p>
              </div>
              
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center text-slate-700 font-semibold">
                    <IndianRupee className="h-4 w-4 text-slate-400 mr-1" />
                    {gig.budget.toLocaleString()}
                </div>
                 <div className="flex items-center text-xs text-slate-500">
                    <span className="mr-2">by {gig.ownerId.name}</span>
                    {/* Placeholder Avatar */}
                    <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                        {gig.ownerId.name.charAt(0)}
                    </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {!loading && gigs.length === 0 && (
        <div className="text-center py-20 bg-white rounded-lg border border-dashed border-slate-300">
          <p className="text-slate-500">No gigs found matching your criteria.</p>
          <button 
            onClick={() => { setSearch(''); setMinBudget(''); setMaxBudget(''); setStatus('open'); }}
            className="text-indigo-600 hover:underline text-sm mt-2"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
