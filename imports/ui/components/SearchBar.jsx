import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const history = useHistory();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      history.push(`/search?q=${searchTerm}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center ml-4">
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-3 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
      />
      <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-r-md text-sm font-medium h-[38px] cursor-pointer">
        <FiSearch />
      </button>
    </form>
  );
};

export default SearchBar;
