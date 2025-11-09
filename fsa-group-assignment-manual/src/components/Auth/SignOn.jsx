import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignOn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("STUDENT");
  const navigate = useNavigate();

  const demoUsers = [
    { label: "Student", role: "STUDENT", color: "text-blue-600" },
    { label: "Staff", role: "STAFF", color: "text-green-600" },
    { label: "Admin", role: "ADMIN", color: "text-orange-500" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      email,
      password,
      role: selectedRole || "STUDENT", // default fallback
    };

    console.log("Logging in with:", payload);
    localStorage.setItem("token", JSON.stringify(payload));
    navigate("/dashboard");
  };

  const handleDemoSelect = (demo) => {
    setSelectedRole(demo.role);
    setEmail(`${demo.label.toLowerCase()}@school.edu`);
    setPassword("password123");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="flex-1 flex flex-col justify-center px-10 lg:px-20 bg-white">
        {/* Logo and Title */}
        <div className="mb-10">
          <div className="flex items-center space-x-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2022.svg"
              alt="EduLend"
              className="h-8"
            />
            <div>
              <h1 className="text-xl font-semibold text-blue-700">EduLend</h1>
              <p className="text-sm text-gray-600">School Equipment Lending</p>
            </div>
          </div>
        </div>

        <div className="max-w-md w-full">
          <h2 className="text-2xl font-semibold mb-2">Welcome Back</h2>
          <p className="text-gray-600 mb-8">
            Sign in to access your equipment lending portal
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your.email@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 text-sm">Password</label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Sign In
            </button>
          </form>

          {/* Create Account */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Don’t have an account?{" "}
            <button
              className="text-blue-600 hover:underline"
              onClick={() => navigate("/create-account")}
            >
              Create Account
            </button>
          </p>

          {/* Divider */}
          <div className="my-6 border-t" />

          {/* Quick Demo Login */}
          <div className="text-sm">
            <p className="text-gray-600 mb-3 font-medium flex justify-center">Select your Role:</p>
            <ul className="space-y-2 flex flex-col items-center">
              {demoUsers.map((demo) => (
                <li
                  key={demo.role}
                  onClick={() => handleDemoSelect(demo)}
                  className={`flex items-center justify-between px-4 py-2 border rounded-lg cursor-pointer transition-all justify-center w-70 ${selectedRole === demo.role
                    ? "bg-blue-50 border-blue-400"
                    : "hover:bg-gray-50"
                    }`}
                >
                  <span className={`${demo.color} font-semibold`}>
                    {demo.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden md:flex flex-1 items-center justify-center relative">
        <img
          src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80"
          alt="Library Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/70 to-teal-400/60 backdrop-blur-sm"></div>

        <div className="relative text-white max-w-md px-10">
          <h2 className="text-2xl font-semibold mb-4">
            Streamline Your Equipment Management
          </h2>
          <p className="text-gray-100">
            EduLend simplifies equipment lending with real-time tracking,
            automated reminders, and seamless approval workflows.
          </p>
        </div>
      </div>
    </div>
  );
}
