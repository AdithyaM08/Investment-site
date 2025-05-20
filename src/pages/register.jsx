import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!agree) {
      alert('You must agree to the terms and conditions');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful!');
        navigate('/login');
      } else {
        alert(data.message || 'Registration failed');
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
      <main className="flex-grow flex items-center justify-center px-6 my-5">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-md p-8 w-1/2"
        >
          <h2 className="text-3xl font-semibold mb-6 text-center text-blue-700">
            Register
          </h2>

          <label
            className="block mb-2 font-medium text-gray-700"
            htmlFor="username"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />

          <label
            className="block mb-2 font-medium text-gray-700"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />

          <label
            className="block mb-2 font-medium text-gray-700"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />

          <label
            className="block mb-2 font-medium text-gray-700"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className="w-full p-3 border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />

          <div className="flex items-center mb-6">
            <input
              id="terms"
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="mr-2"
              required
            />
            <label htmlFor="terms" className="text-gray-700">
              I agree to the{' '}
              <a href="/terms" className="text-blue-600 hover:underline">
                Terms and Conditions
              </a>
            </label>
          </div>

          <button
            type="submit"
            disabled={!agree}
            className={`w-full py-3 rounded-md font-semibold transition ${
              agree
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Register
          </button>

          <p className="mt-6 text-center text-gray-700">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
};

export default Register;
