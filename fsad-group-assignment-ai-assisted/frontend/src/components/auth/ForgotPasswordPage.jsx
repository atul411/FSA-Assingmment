import React, { useState } from 'react';
import { Logo } from '../Logo';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/auth/forgotpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || 'Failed to send reset link');
      }

      setSent(true);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-[#2F5DFF]/5 to-[#10B981]/5">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Logo variant="default" className="justify-center mb-6" />
          <h1 className="text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">Enter your email to receive reset instructions</p>
        </div>

        {!sent ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-200"
          >
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

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-600">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-[#2F5DFF] hover:bg-[#2548CC]"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </form>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
              </div>
            </div>

            <Alert className="border-[#10B981]/20 bg-[#10B981]/5">
              <AlertDescription className="text-[#10B981]">
                Password reset link has been sent to {email}
              </AlertDescription>
            </Alert>

            <p className="text-gray-600">
              Check your email and follow the instructions to reset your password.
            </p>

            <Button onClick={() => onNavigate('login')} variant="outline" className="w-full">
              Back to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
