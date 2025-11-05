import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleAuthService from '../../utils/GoogleAuth';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function AuthCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          toast.error('Google authentication was cancelled');
          navigate('/login');
          return;
        }

        if (code) {
          const data = await GoogleAuthService.handleCallback(code);

          // Update Redux store
          dispatch(setUserData(data.user));

          toast.success('Successfully signed in with Google!');
          navigate('/');
        } else {
          toast.error('No authorization code received');
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error(error.message || 'Authentication failed');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ClipLoader size={50} color="#000" />
          <p className="mt-4 text-gray-600">Authenticating with Google...</p>
        </div>
      </div>
    );
  }

  return null;
}

export default AuthCallback;
