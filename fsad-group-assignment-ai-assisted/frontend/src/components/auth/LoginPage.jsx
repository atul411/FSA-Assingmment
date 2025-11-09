import React, { useState } from 'react';
import { Logo } from '../Logo';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';

export const LoginPage = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('student');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password.');
      }

      // ✅ Save token and user details
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // ✅ Navigate to dashboard
      onNavigate('dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (selectedRole) => {
    setRole(selectedRole);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Logo variant="default" className="justify-center mb-6" />
            <h1 className="text-gray-900 mb-2 text-2xl font-semibold">Welcome Back</h1>
            <p className="text-gray-600">Sign in to access your equipment lending portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="text-[#2F5DFF] hover:underline text-sm"
                >
                  Forgot Password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#2F5DFF] hover:bg-[#2548CC] ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <button
              onClick={() => onNavigate('signup')}
              className="text-[#2F5DFF] hover:underline"
            >
              Create Account
            </button>
          </div>

          {/* Quick login options */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-gray-600 mb-3 text-sm font-medium">
              Quick Demo Login:
            </p>
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                className={`w-full justify-start border-gray-300 ${
                  role === 'student' ? 'bg-green-100' : ''
                }`}
                onClick={() => quickLogin('student')}
              >
                <span className="text-[#2F5DFF] font-semibold">Student</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className={`w-full justify-start border-gray-300 ${
                  role === 'staff' ? 'bg-green-100' : ''
                }`}
                onClick={() => quickLogin('staff')}
              >
                <span className="text-[#10B981] font-semibold">Staff</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className={`w-full justify-start border-gray-300 ${
                  role === 'admin' ? 'bg-green-100' : ''
                }`}
                onClick={() => quickLogin('admin')}
              >
                <span className="text-[#F59E0B] font-semibold">Admin</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Background */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-[#2F5DFF] to-[#10B981]">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1706078355012-f327ce8edeea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBjYW1wdXMlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc2MTY2NDc3Mnww&ixlib=rb-4.1.0&q=80&w=1080)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative h-full flex items-center justify-center p-12 text-white">
          <div className="max-w-lg text-center space-y-6">
            <h2 className="text-white text-2xl font-semibold">
              Streamline Your Equipment Management
            </h2>
            <p className="text-white/90 text-lg">
              EduLend simplifies equipment lending with real-time tracking, automated reminders, and seamless approval workflows.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
