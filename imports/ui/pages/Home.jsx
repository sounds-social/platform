import React, { useState } from 'react';
import { HeadProvider, Title } from 'react-head';
import Discover from './Discover';
import Following from './Following';

const Home = () => {
  const [activeTab, setActiveTab] = useState('discover');

  return (
    <div>
      <HeadProvider>
        <Title>Home - Sounds Social</Title>
      </HeadProvider>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('discover')}
            className={`${activeTab === 'discover' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer`}
          >
            Discover
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`${activeTab === 'following' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer`}
          >
            Following
          </button>
        </nav>
      </div>

      <div className="mt-8">
        {activeTab === 'discover' && <Discover />}
        {activeTab === 'following' && <Following />}
      </div>
    </div>
  );
};

export default Home;
