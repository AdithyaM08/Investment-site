import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from './usercontext';

const Portfolio = () => {
  const { user } = useUser();
  const [portfolio, setPortfolio] = useState([]);

  const fetchPortfolio = () => {
    if (user && user.userId) {
      fetch(`http://localhost:5000/api/portfolio/${user.userId}`)
        .then(res => res.json())
        .then(data => setPortfolio(data))
        .catch(console.error);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [user]);

  const handleSell = async (portfolioId) => {
    if (!window.confirm('Are you sure you want to sell this stock?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/portfolio/${portfolioId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Stock sold successfully!');
        fetchPortfolio();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to sell stock');
      }
    } catch (error) {
      alert('Error connecting to server');
      console.error(error);
    }
  };

  const username = user?.username || 'User';

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
        <div className="text-2xl font-bold text-black">StockPulse</div>
        <nav className="space-x-6 text-gray-700 font-medium">
          <Link to="/stocks" className="hover:text-blue-700">Stocks</Link>
          <Link to="/" className="hover:text-blue-700">Logout</Link>
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center px-6 py-16 w-full max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Welcome, <span className="text-blue-600">{username}</span>!</h1>
        <h2 className="text-2xl mb-6">Your Portfolio</h2>

        {portfolio.length === 0 ? (
          <p className="text-gray-600 text-lg">Your portfolio is empty.</p>
        ) : (
          <div className="bg-white rounded shadow w-full max-w-5xl overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-6 text-left font-semibold text-gray-700">Stock Name</th>
                  <th className="py-3 px-6 text-left font-semibold text-gray-700">Symbol</th>
                  <th className="py-3 px-6 text-right font-semibold text-gray-700">Quantity</th>
                  <th className="py-3 px-6 text-right font-semibold text-gray-700">Purchase Price</th>
                  <th className="py-3 px-6 text-right font-semibold text-gray-700">Total Value</th>
                  <th className="py-3 px-6"></th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map(item => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-6">{item.name}</td>
                    <td className="py-3 px-6">{item.symbol}</td>
                    <td className="py-3 px-6 text-right">{item.quantity}</td>
                    <td className="py-3 px-6 text-right">${Number(item.purchase_price).toFixed(2)}</td>
                    <td className="py-3 px-6 text-right">${(item.quantity * Number(item.purchase_price)).toFixed(2)}</td>
                    <td className="py-3 px-6 text-center">
                      <button
                        onClick={() => handleSell(item.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition font-semibold"
                      >
                        Sell
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Portfolio;
