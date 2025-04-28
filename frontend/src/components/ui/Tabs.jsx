import { useState } from 'react';

const Tabs = ({ tabs, defaultTab, onChange }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  return (
    <div>
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs?.map((tab) => (
          <button
            key={tab.id}
            className={`px-6 py-3 font-medium text-sm transition-all duration-300 relative ${
              activeTab === tab.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-primary hover:border-gray-300'
            }`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-100 transition-transform duration-300"></span>
            )}
          </button>
        ))}
      </div>
      <div className="pt-4">
        {tabs.map((tab) => (
          <div 
            key={tab.id} 
            className={`transform transition-all duration-300 ${
              activeTab === tab.id 
                ? 'block opacity-100 animate-fadeIn' 
                : 'hidden opacity-0'
            }`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;