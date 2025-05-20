import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from './usercontext';

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const Stocks = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '' });
  const [stocks, setStocks] = useState([]);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.append('search', debouncedSearch);
    if (filters.status) params.append('status', filters.status);

    fetch(`http://localhost:5000/api/stocks?${params.toString()}`)
      .then(res => res.json())
      .then(data => setStocks(data))
      .catch(console.error);
  }, [debouncedSearch, filters.status]);

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
        <div className="text-2xl font-bold text-black">StockPulse</div>
        <nav className="space-x-6 text-gray-700 font-medium">
          <Link to="/portfolio" className="hover:text-blue-700">Portfolio</Link>
          <Link to="/" className="hover:text-blue-700">Logout</Link>
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center px-6 py-16 text-center w-full max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">
          Welcome, <span className="text-blue-600">{user ? user.username : 'User'}</span>!
        </h1>
        <p className="max-w-3xl text-gray-700 text-lg mb-10">
          Explore your portfolio and discover new investment opportunities. Use the search and filters below to find stocks tailored to your preferences.
        </p>

        <div className="flex w-full max-w-6xl gap-4 mb-12">
          <input
            type="text"
            placeholder="Search stocks by name or symbol..."
            className="flex-grow p-4 border border-gray-400 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-48 p-4 border border-gray-400 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Hot">Hot</option>
          </select>
        </div>

        <div className="bg-white rounded-md shadow overflow-x-auto w-full max-w-6xl">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-6 text-left font-semibold text-gray-700">Name</th>
                <th className="py-3 px-6 text-left font-semibold text-gray-700">Symbol</th>
                <th className="py-3 px-6 text-right font-semibold text-gray-700">Price</th>
                <th className="py-3 px-6 text-left font-semibold text-gray-700">Status</th>
                <th className="py-3 px-6"></th>
              </tr>
            </thead>
            <tbody>
              {stocks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-600">No stocks found.</td>
                </tr>
              ) : (
                stocks.map(stock => (
                  <tr key={stock.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-6">{stock.name}</td>
                    <td className="py-3 px-6">{stock.symbol}</td>
                    <td className="py-3 px-6 text-right">${stock.price ? Number(stock.price).toFixed(2) : 'N/A'}</td>
                    <td className="py-3 px-6">{stock.stock_status}</td>
                    <td className="py-3 px-6">
                      <button
                        onClick={() => navigate(`/stocks/${stock.id}`)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">
                        View Stock
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Stocks;
