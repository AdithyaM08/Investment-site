import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './pages/usercontext.jsx';
import Landing from './pages/landing.jsx';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';
import Stocks from './pages/stocks.jsx';
import StockDetails from './pages/details.jsx';
import Portfolio from './pages/portfolio.jsx';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/stocks/:id" element={<StockDetails />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
