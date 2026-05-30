import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../api';
import { useAuth } from '../context/AuthContext';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing.');
      return;
    }

    authAPI.verifyEmail(token)
      .then(async ({ data }) => {
        setStatus('success');
        setMessage(data?.message || 'Email verified successfully.');
        await refreshUser().catch(() => null);
        setTimeout(() => navigate('/dashboard'), 900);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification link is invalid or expired.');
      });
  }, [searchParams, refreshUser, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 flex items-center justify-center">
      <div className="card max-w-md w-full mx-auto text-center">
        <h2 className="text-xl font-normal text-slate-900 mb-3">Email verification</h2>
        <p className={`text-sm ${status === 'success' ? 'text-emerald-600' : status === 'error' ? 'text-rose-600' : 'text-slate-500'}`}>
          {message}
        </p>
        {status === 'success' ? (
          <p className="text-xs text-slate-500 mt-5">Redirecting to dashboard...</p>
        ) : (
          <Link to="/login" className="btn-primary w-full inline-flex justify-center mt-5">
            Go to sign in
          </Link>
        )}
      </div>
    </div>
  );
}
