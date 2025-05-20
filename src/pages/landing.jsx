import React from 'react';
import { useNavigate } from 'react-router-dom';
const Landing = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="flex justify-between items-center px-8 py-4 bg-white-100 shadow-md">
                <div className="text-2xl font-bold text-shadow-black">StockPulse</div>
                <nav className="space-x-6 text-gray-700 font-medium">
                    <a href="/" className="hover:text-blue-700">Home</a>
                    <a href="/login" className="hover:text-blue-700">Login/Register</a>
                    <a href="/about" className="hover:text-blue-700">About Us</a>
                </nav>
            </header>
            <main className="flex-grow flex flex-col items-center justify-center px-6 text-center">
                <h1 className="text-6xl font-extrabold text-black-500 mb-6 leading-tight">
                    Welcome to StockPulse!
                </h1>
                <p className="max-w-3xl text-lg text-gray-700 mb-10">
                    Your simple and secure platform to browse stocks, manage your portfolio, and make smart investments with confidence.
                </p>
                <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-8 py-4 rounded-md text-xl font-semibold hover:bg-blue-700 transition">
                    Get Started
                </button>
            </main>
        </div>
    );
};

export default Landing;
