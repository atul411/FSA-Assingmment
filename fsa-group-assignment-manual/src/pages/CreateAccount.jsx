import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function CreateAccount() {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        schoolId: "",
        role: "Student",
        password: "",
        confirmPassword: ""
    });

    const roles = ["Student", "Staff", "Admin"];

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Creating account:", form);
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Section */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-white p-8">
                {/* Logo */}
                <div className="flex items-center space-x-2 mb-6">
                    <div className="text-blue-600 font-bold text-2xl">L1</div>
                    <div>
                        <h1 className="text-xl font-semibold text-blue-600">EduLend</h1>
                        <p className="text-sm text-gray-500">School Equipment Lending</p>
                    </div>
                </div>

                <h2 className="text-2xl font-semibold mb-2">Create Account</h2>
                <p className="text-gray-500 mb-6 text-center">
                    Join EduLend to start borrowing equipment
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="your.email@school.edu"
                            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">School ID</label>
                        <input
                            type="text"
                            name="schoolId"
                            value={form.schoolId}
                            onChange={handleChange}
                            placeholder="STU-2024-XXX"
                            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Role</label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                            {roles.map((r) => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Minimum 6 characters"
                            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="Re-enter password"
                            className="mt-1 w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition"
                    >
                        Create Account
                    </button>
                </form>

                <p className="mt-6 text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/" className="text-blue-600 font-medium hover:underline">
                        Sign In
                    </Link>
                </p>

            </div>

            {/* Right Section */}
            <div
                className="hidden md:flex w-1/2 justify-center items-center text-white text-center p-8"
                style={{
                    backgroundImage:
                        "linear-gradient(to bottom right, rgba(0,120,255,0.8), rgba(0,200,200,0.8)), url('https://images.unsplash.com/photo-1542060748-10c28b62716c')",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
                    <p className="max-w-sm">
                        Access thousands of equipment items, track your loans, and enjoy
                        hassle-free returns.
                    </p>
                </div>
            </div>
        </div>
    );
}
