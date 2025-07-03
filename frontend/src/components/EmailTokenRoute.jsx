import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const EmailTokenRoute = ({ children }) => {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await axios.post('/api/admin/verify-token', { token });
        if (res.data.valid) {
          setAuthorized(true);
        }
      } catch (err) {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  if (loading) return <div className="p-4">🔄 Verifying token...</div>;
  if (!authorized) return <div className="p-4 text-red-600 font-semibold">⛔ Invalid or expired token</div>;

  return children;
};

export default EmailTokenRoute;
