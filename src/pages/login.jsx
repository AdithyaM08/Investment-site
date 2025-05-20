import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from './usercontext';

const Login = () => {
  const [formData, setFormData] = useState({ usernameOrEmail: '', password: '' });
  const { setUserData } = useUser();
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setUserData({ username: data.username, userId: data.userId });
        alert('Login successful!');
        navigate('/stocks'); 
      } else {
        alert(data.message || 'Login failed');
        if (data.message && data.message.toLowerCase().includes('no user')) {
          navigate('/register');
        }
      }
    } catch (error) {
      alert('Error connecting to server');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
        <div className="text-2xl font-bold text-black">StockPulse</div>
        <nav className="space-x-6 text-gray-700 font-medium">
          <Link to="/" className="hover:text-blue-700">Home</Link>
          <Link to="/login" className="hover:text-blue-700">Login/Register</Link>
          <Link to="/about" className="hover:text-blue-700">About Us</Link>
        </nav>
      </header>

      <main className="flex-grow flex items-center justify-center px-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-md p-8 w-full max-w-md"
        >
          <h2 className="text-3xl font-semibold mb-6 text-center text-blue-700">Login</h2>

          <label htmlFor="usernameOrEmail" className="block mb-2 font-medium text-gray-700">
            Email or Username
          </label>
          <input
            id="usernameOrEmail"
            type="text"
            value={formData.usernameOrEmail}
            onChange={handleChange}
            placeholder="Enter your email or username"
            className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />

          <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full p-3 border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>

          <p className="mt-6 text-center text-gray-700">
            New user?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
          </p>
        </form>
      </main>
    </div>
  );
};

export default Login;
