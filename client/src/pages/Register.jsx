import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Briefcase } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      toast.success('Registered successfully');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 -mt-20">
        <div className="text-center">
            <div className="flex justify-center mb-4">
                <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                    <Briefcase className="h-6 w-6" />
                </div>
            </div>
          <h2 className="text-3xl font-extrabold text-slate-900">Create account</h2>
          <p className="mt-2 text-sm text-slate-600">Start your freelance journey today</p>
        </div>

        <div className="card p-8 shadow-md">
            <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                    type="text"
                    required
                    className="input-field"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                <input
                    type="email"
                    required
                    className="input-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input
                    type="password"
                    required
                    className="input-field"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <div>
                <button
                type="submit"
                className="w-full btn btn-primary"
                >
                Sign up
                </button>
            </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
