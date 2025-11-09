import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5001/api/auth/forgotpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      // try parse JSON, but tolerate non-JSON responses
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send reset link');
      }

      setSuccessMessage(data.message || 'If an account with that email exists, a reset link has been sent.');
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred while sending reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-blue-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 text-center">
        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center space-x-2">
            {/* Placeholder logo */}
            <div className="w-8 h-8 bg-blue-600 rounded-md" />
            <span className="text-xl font-semibold text-blue-700">EduLend</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">School Equipment Lending</p>
        </div>

        {/* Reset Password Text */}
        <h2 className="text-lg font-medium text-gray-800 mb-1">Reset Password</h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter your email to receive reset instructions
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-left">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@school.edu"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {successMessage && (
          <div className="mt-4 p-3 text-green-700 bg-green-50 rounded-md text-sm">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 p-3 text-red-700 bg-red-50 rounded-md text-sm">
            {errorMessage}
          </div>
        )}

        {/* Back to Login */}
        <button
          onClick={() => alert("Navigate to login")}
          className="mt-6 text-sm text-gray-600 hover:text-blue-600 flex items-center justify-center space-x-1"
        >
          <span>←</span>
          <span>Back to Login</span>
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
