'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthFormsProps {
  onAuthSuccess?: () => void;
}

export const AuthForms: React.FC<AuthFormsProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup, login, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isResetPassword) {
        await resetPassword(email);
        setMessage('Password reset email sent! Check your inbox.');
        setIsResetPassword(false);
      } else if (isLogin) {
        await login(email, password);
        onAuthSuccess?.();
      } else {
        await signup(email, password);
        onAuthSuccess?.();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (isResetPassword) {
    return (
      <div className="w-full max-w-md mx-auto bg-neutral-900 p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-neutral-50">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded">
              {message}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-50 focus:ring-2 focus:ring-neutral-600 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-700 hover:bg-neutral-600 text-neutral-50 font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Email'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsResetPassword(false);
              setError('');
              setMessage('');
            }}
            className="w-full text-neutral-400 hover:text-neutral-50 text-sm"
          >
            Back to login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-neutral-900 p-8 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-neutral-50">
        {isLogin ? 'Login' : 'Sign Up'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-50 focus:ring-2 focus:ring-neutral-600 focus:border-transparent"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-50 focus:ring-2 focus:ring-neutral-600 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-neutral-700 hover:bg-neutral-600 text-neutral-50 font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
        </button>
        <div className="flex justify-between text-sm">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-neutral-400 hover:text-neutral-50"
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
          </button>
          {isLogin && (
            <button
              type="button"
              onClick={() => {
                setIsResetPassword(true);
                setError('');
              }}
              className="text-neutral-400 hover:text-neutral-50"
            >
              Forgot password?
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
