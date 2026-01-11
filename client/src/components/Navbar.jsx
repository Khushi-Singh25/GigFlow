import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Briefcase, User, LogOut, PlusCircle, LayoutGrid, Bell } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-indigo-600" />
              <span className="text-xl font-bold text-slate-900 tracking-tight">GigFlow</span>
            </Link>
            
            {user && (
              <div className="hidden md:flex items-center gap-1">
                 <Link 
                  to="/" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/') ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  Browse
                </Link>
                <Link 
                  to="/my-gigs" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/my-gigs') ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  My Gigs
                </Link>
                <Link 
                  to="/dashboard" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  Dashboard
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                 <div className="relative">
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full relative"
                    >
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-50">
                            <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-semibold text-slate-900">Notifications</h3>
                                <span className="text-xs text-slate-500">{unreadCount} unread</span>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="px-4 py-6 text-center text-slate-500 text-sm">
                                        No notifications yet
                                    </div>
                                ) : (
                                    notifications.map((notification) => (
                                        <div 
                                            key={notification._id} 
                                            onClick={() => {
                                                if (!notification.isRead) markAsRead(notification._id);
                                            }}
                                            className={`px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 ${!notification.isRead ? 'bg-indigo-50/50' : ''}`}
                                        >
                                            <p className="text-sm text-slate-800">{notification.message}</p>
                                            <p className="text-xs text-slate-400 mt-1">{new Date(notification.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                 </div>

                <Link to="/create-gig" className="btn btn-primary gap-2">
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Post Gig</span>
                </Link>
                
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-full hover:bg-slate-50"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
