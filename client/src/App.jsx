import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateGig from './pages/CreateGig';
import GigDetails from './pages/GigDetails';
import MyGigs from './pages/MyGigs';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/create-gig"
            element={
              <ProtectedRoute>
                <CreateGig />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-gigs"
            element={
              <ProtectedRoute>
                <MyGigs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/gigs/:id" element={<GigDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
