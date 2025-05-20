import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUser } from './usercontext';

const StockDetails = () => {
  const { id } = useParams();
  const { user } = useUser();
  const userId = user ? user.userId : null;

  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`http://localhost:5000/api/stocks/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Stock not found');
        return res.json();
      })
      .then(data => {
        setStock(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const totalPrice = stock ? stock.price * quantity : 0;

  const handleBuyNow = async () => {
    if (!userId) {
      alert('User not logged in.');
      return;
    }
    if (quantity < 1) {
      alert('Quantity must be at least 1.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/portfolio/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          stock_id: id,
          quantity,
          purchase_price: stock.price,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Successfully purchased ${quantity} shares of ${stock.name} for $${totalPrice.toFixed(2)}`);
      } else {
        alert(data.message || 'Purchase failed');
      }
    } catch (error) {
      alert('Error connecting to server');
      console.error(error);
    }
  };

  if (loading) return <p className="p-8 text-center">Loading...</p>;
  if (!stock) return <p className="p-8 text-center text-red-600">Stock not found.</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gray-200 rounded shadow mt-10">
      <h1 className="text-4xl font-bold mb-4">{stock.name} ({stock.symbol})</h1>
      <p className="text-xl mb-2">Price: ${Number(stock.price).toFixed(2)}</p>
      <p className="mb-6">Status: {stock.stock_status}</p>

      <div className="flex items-center gap-4 mb-6">
        <label htmlFor="quantity" className="font-semibold text-lg">Quantity:</label>
        <input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
          className="w-24 p-2 border border-gray-300 rounded bg-gray-50"
        />
        <button
          onClick={handleBuyNow}
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition font-semibold"
        >
          Buy Now for ${totalPrice.toFixed(2)}
        </button>
      </div>

      <div className="mb-6 font-semibold text-lg">
        Total: ${totalPrice.toFixed(2)}
      </div>

      <div className="mt-8">
        <Link to="/stocks" className="text-blue-600 hover:underline">← Back to Stocks</Link>
      </div>
    </div>
  );
};

export default StockDetails;
