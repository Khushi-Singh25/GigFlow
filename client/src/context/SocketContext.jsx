const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io(API_URL, {
        withCredentials: true,
      });

      newSocket.on('connect', () => {
        console.log('Connected to socket server');
        newSocket.emit('join', user._id);
      });

      newSocket.on('notification', (data) => {
        toast(data.message, {
            icon: '🎉',
            duration: 5000,
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
        setNotifications((prev) => [data, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });

      setSocket(newSocket);
      fetchNotifications();

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/notifications`);
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error('Failed to fetch notifications');
    }
  };

  const markAsRead = async (id) => {
    try {
        await axios.patch(`${API_URL}/api/notifications/${id}/read`);
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, notifications, unreadCount, markAsRead }}>
      {children}
    </SocketContext.Provider>
  );
};
