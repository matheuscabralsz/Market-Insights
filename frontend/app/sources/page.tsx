'use client';

import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useState } from 'react';

export default function Sources() {
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data - will be replaced with real data later
  const mockSources = [
    {
      id: 1,
      name: 'Bloomberg Analysis',
      category: 'Financial News',
      url: 'bloomberg.com/markets',
      status: 'active',
      accuracy: 87,
      totalPredictions: 145,
      correctPredictions: 126,
      credibilityWeight: 1.5,
      lastScraped: '1 hour ago',
      avgConfidence: 82,
    },
    {
      id: 2,
      name: 'CoinDesk',
      category: 'Crypto News',
      url: 'coindesk.com/markets',
      status: 'active',
      accuracy: 79,
      totalPredictions: 203,
      correctPredictions: 160,
      credibilityWeight: 1.2,
      lastScraped: '30 mins ago',
      avgConfidence: 75,
    },
    {
      id: 3,
      name: 'Wall Street Journal',
      category: 'Financial News',
      url: 'wsj.com/markets',
      status: 'active',
      accuracy: 91,
      totalPredictions: 98,
      correctPredictions: 89,
      credibilityWeight: 1.8,
      lastScraped: '2 hours ago',
      avgConfidence: 88,
    },
    {
      id: 4,
      name: 'Seeking Alpha',
      category: 'Investment Analysis',
      url: 'seekingalpha.com',
      status: 'active',
      accuracy: 74,
      totalPredictions: 312,
      correctPredictions: 231,
      credibilityWeight: 1.0,
      lastScraped: '45 mins ago',
      avgConfidence: 71,
    },
    {
      id: 5,
      name: 'The Block',
      category: 'Crypto News',
      url: 'theblock.co',
      status: 'paused',
      accuracy: 82,
      totalPredictions: 156,
      correctPredictions: 128,
      credibilityWeight: 1.3,
      lastScraped: '1 day ago',
      avgConfidence: 78,
    },
  ];

  return (
    <div className="relative">
      {/* Not done yet overlay */}
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
        <div className="bg-gray-800 border border-gray-700 rounded-lg px-6 py-4 shadow-xl">
          <p className="text-xl font-semibold text-white">Not done yet</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white">Source Management</h1>
          <p className="mt-2 text-gray-400">
            Manage and configure your data sources and their credibility weights
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Source
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-white mb-1">8</div>
            <div className="text-sm text-gray-400">Total Sources</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">5</div>
            <div className="text-sm text-gray-400">Active</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-white mb-1">83%</div>
            <div className="text-sm text-gray-400">Avg Accuracy</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-white mb-1">914</div>
            <div className="text-sm text-gray-400">Total Predictions</div>
          </CardBody>
        </Card>
      </div>

      {/* Sources Table */}
      <Card>
        <CardHeader
          title="All Sources"
          subtitle={`${mockSources.length} sources configured`}
        />
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Accuracy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Predictions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Weight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Last Scraped
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {mockSources.map((source) => (
                  <tr key={source.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{source.name}</div>
                        <div className="text-xs text-gray-400">{source.category}</div>
                        <div className="text-xs text-gray-500">{source.url}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={source.status === 'active' ? 'success' : 'neutral'}
                        size="sm"
                      >
                        {source.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-white">{source.accuracy}%</div>
                          <div className="w-24 bg-gray-700 rounded-full h-1.5 mt-1">
                            <div
                              className={`h-1.5 rounded-full ${
                                source.accuracy >= 85
                                  ? 'bg-green-500'
                                  : source.accuracy >= 75
                                  ? 'bg-blue-500'
                                  : 'bg-yellow-500'
                              }`}
                              style={{ width: `${source.accuracy}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{source.totalPredictions}</div>
                      <div className="text-xs text-gray-400">
                        {source.correctPredictions} correct
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0.5"
                          max="2.0"
                          step="0.1"
                          value={source.credibilityWeight}
                          className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                          readOnly
                        />
                        <span className="text-sm text-white w-8">{source.credibilityWeight}x</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {source.lastScraped}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button className="text-blue-400 hover:text-blue-300 mr-3">Edit</button>
                      <button className="text-gray-400 hover:text-gray-300">
                        {source.status === 'active' ? 'Pause' : 'Resume'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
      </div>

      {/* Add Source Modal (simplified) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader
              title="Add New Source"
              subtitle="Configure a new data source for market insights"
            />
            <CardBody>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Source Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Reuters Markets"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Financial News</option>
                    <option>Crypto News</option>
                    <option>Investment Analysis</option>
                    <option>Market Research</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Initial Credibility Weight
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    defaultValue="1.0"
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0.5x</span>
                    <span>1.0x</span>
                    <span>2.0x</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6 justify-end">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
                  Add Source
                </button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
