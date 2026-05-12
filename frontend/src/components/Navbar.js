import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [lang, setLang] = useState('EN');

  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-blue-500">
        HealthCare 🏥
      </div>
      <div className="flex gap-6 items-center">
        <Link to="/" className="text-gray-600 hover:text-blue-500 font-medium">Home</Link>
        <Link to="/services" className="text-gray-600 hover:text-blue-500 font-medium">Services</Link>
        <Link to="/about" className="text-gray-600 hover:text-blue-500 font-medium">About</Link>
        <button
          onClick={() => setLang(lang === 'EN' ? 'FR' : 'EN')}
          className="border border-blue-500 text-blue-500 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-500 hover:text-white transition">
          {lang}
        </button>
        <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition">
          Sign In
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;