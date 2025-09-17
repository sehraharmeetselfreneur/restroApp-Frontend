import React, { useState } from "react";
import { FaEnvelope, FaLock, FaKey, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const RestaurantLogin = () => {
    const heroImageUrl = "https://images.unsplash.com/photo-1551270273-df33a598c430";
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        otp: "",
    });

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login Data:", formData);
        // 🔗 Call your login API here
    };

    return (
        <div className="min-h-screen flex items-center justify-between bg-gradient-to-br from-slate-500 via-white to-slate-400 relative overflow-hidden">
            {/* Form (Left Part) */}
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl m-8 p-8 md:p-12 relative z-10 border border-slate-100">
                {/* Logo and Title */}
                <div className="text-center mb-10 select-none">
                    <div className="flex justify-center mb-4">
                        <span className="text-5xl font-extrabold text-orange-500">FlavorForge</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                        Partner Login
                    </h1>
                    <p className="text-slate-500 mt-2 font-light text-lg">
                        Manage your restaurant with ease
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="relative group">
                        <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300" />
                        <input
                            type="email"
                            placeholder="Your email address"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all duration-300 text-slate-700 placeholder-slate-400 font-medium"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="relative group">
                        <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => handleChange("password", e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all duration-300 text-slate-700 placeholder-slate-400 font-medium"
                            required
                        />
                    </div>

                    {/* OTP */}
                    <div className="relative group">
                        <FaKey className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300" />
                        <input
                            type="text"
                            placeholder="Enter OTP (if applicable)"
                            value={formData.otp}
                            onChange={(e) => handleChange("otp", e.target.value)}
                            className="w-full pl-12 pr-32 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition-all duration-300 text-slate-700 placeholder-slate-400 font-medium"
                        />
                        <button
                            type="button"
                            onClick={() => console.log("Send OTP to", formData.email)}
                            className="absolute cursor-pointer right-2 top-2 text-sm px-4 py-2 bg-slate-100 text-slate-600 rounded-lg shadow-sm hover:bg-slate-200 transition-colors duration-300 font-semibold"
                        >
                            Get OTP
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full cursor-pointer bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                    >
                        <span>Login to Dashboard</span>
                        <FaArrowRight />
                    </button>
                </form>

                {/* Footer Links */}
                <div className="text-center mt-8 text-sm select-none text-slate-500">
                    <p>
                        Don’t have an account?{" "}
                        <Link
                            to="/restaurant-signup"
                            className="text-orange-600 cursor-pointer font-bold hover:underline hover:text-orange-700 transition"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Part */}
            <div className="hidden md:flex w-1/2 h-screen relative overflow-hidden bg-orange-500">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-500 transform scale-100 group-hover:scale-105"
                    style={{ backgroundImage: `url(${heroImageUrl})` }}
                ></div>

                {/* Semi-transparent Overlay */}
                {/* <div className="absolute inset-0 bg-black opacity-20"></div> */}

                {/* Content Overlay */}
                <div className="relative z-10 p-12 text-white flex flex-col justify-center gap-10 items-start">
                    <h1 className="text-4xl lg:text-5xl text-center w-full font-extrabold leading-tight tracking-wide drop-shadow-lg">
                        FlavorForge
                    </h1>
                    <div>
                        <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-wide drop-shadow-lg">
                            Grow Your Business with Us
                        </h2>
                        <p className="mt-4 text-lg lg:text-xl font-light leading-relaxed drop-shadow-md">
                            Join our network of successful restaurants and unlock new opportunities. Streamline your operations, reach more customers, and elevate your brand.
                        </p>
                        <blockquote className="mt-8 text-sm italic border-l-4 border-orange-300 pl-4 text-white">
                            "Our revenue increased by 30% in the first three months. The platform is a game-changer!"
                            <footer className="mt-2 text-xs text-white">- Jane Doe, Owner of "The Local Eatery"</footer>
                        </blockquote>
                    </div>

                    <div className="flex justify-center items-start w-full">
                        <img
                            className="w-[80%] h-[80%] object-cover rounded-2xl"
                            src="https://images.unsplash.com/photo-1556745750-68295fefafc5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxzZWFyY2h8MXx8UmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D" alt=""
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantLogin;