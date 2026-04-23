import { useState } from 'react';

const Tabs = ({ items, defaultTab = 0, onChange }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (idx) => {
    setActiveTab(idx);
    onChange?.(idx);
  };

  const activeItem = items[activeTab];

  return (
    <div className="w-full">
      {/* Tab List */}
      <div className="border-b border-slate-200 bg-white rounded-t-lg overflow-x-auto">
        <div className="flex gap-0">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleTabChange(idx)}
              className={`
                px-4 py-3.5 text-sm font-medium whitespace-nowrap
                border-b-2 transition-colors
                ${
                  activeTab === idx
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-200'
                }
              `}
            >
              {item.icon && <span className="mr-1">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-lg border border-t-0 border-slate-200 p-6">
        {activeItem.content}
      </div>
    </div>
  );
};

export default Tabs;
