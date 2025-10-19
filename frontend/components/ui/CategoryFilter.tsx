'use client';

import { useState, useRef, useEffect } from 'react';

interface Opportunity {
  id: number;
  asset: string;
  type: string;
  category: string;
  confidence: number;
  sources: number;
  prediction: string;
  timeframe: string;
  lastUpdated: string;
}

interface CategoryFilterProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  opportunities: Opportunity[];
}

export function CategoryFilter({
  selectedCategories,
  onCategoryChange,
  opportunities
}: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Extract unique categories from opportunities
  const categories = Array.from(new Set(opportunities.map(opp => opp.category))).sort();

  // Get count of opportunities per category
  const categoryCounts = categories.reduce((acc, category) => {
    acc[category] = opportunities.filter(opp => opp.category === category).length;
    return acc;
  }, {} as Record<string, number>);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const clearAll = () => {
    onCategoryChange([]);
    setIsOpen(false);
  };

  const selectAll = () => {
    onCategoryChange(categories);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
      >
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-white">
            {selectedCategories.length === 0
              ? 'All Categories'
              : selectedCategories.length === 1
              ? selectedCategories[0]
              : `${selectedCategories.length} Categories`}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
          {/* Quick Actions */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
            <button
              onClick={selectAll}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Select All
            </button>
            <button
              onClick={clearAll}
              className="text-xs text-gray-400 hover:text-gray-300 transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Category List */}
          <div className="max-h-64 overflow-y-auto py-2">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center justify-between px-4 py-2 hover:bg-gray-700/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-white">{category}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {categoryCounts[category]}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
