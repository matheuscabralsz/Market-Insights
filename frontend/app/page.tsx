'use client';

import { useState } from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CategoryFilter } from '@/components/ui/CategoryFilter';

export default function Dashboard() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Mock data - will be replaced with real data later
  const mockOpportunities = [
    {
      id: 1,
      asset: 'AAPL',
      type: 'Stock',
      category: 'US Stocks',
      confidence: 85,
      sources: 4,
      prediction: 'Bullish',
      timeframe: '1-3 months',
      lastUpdated: '2 hours ago',
    },
    {
      id: 2,
      asset: 'BTC',
      type: 'Crypto',
      category: 'Cryptocurrencies',
      confidence: 92,
      sources: 5,
      prediction: 'Bullish',
      timeframe: '1-2 weeks',
      lastUpdated: '4 hours ago',
    },
    {
      id: 3,
      asset: 'TSLA',
      type: 'Stock',
      category: 'US Stocks',
      confidence: 78,
      sources: 3,
      prediction: 'Bearish',
      timeframe: '2-4 weeks',
      lastUpdated: '1 day ago',
    },
    {
      id: 4,
      asset: 'EURUSD',
      type: 'Forex',
      category: 'Forex',
      confidence: 88,
      sources: 4,
      prediction: 'Bullish',
      timeframe: '1 week',
      lastUpdated: '5 hours ago',
    },
    {
      id: 5,
      asset: 'XAUUSD',
      type: 'Forex',
      category: 'Forex',
      confidence: 91,
      sources: 5,
      prediction: 'Bullish',
      timeframe: '2-3 weeks',
      lastUpdated: '3 hours ago',
    },
    {
      id: 6,
      asset: 'PETR4',
      type: 'Stock',
      category: 'BR Stocks',
      confidence: 76,
      sources: 3,
      prediction: 'Bearish',
      timeframe: '1 month',
      lastUpdated: '8 hours ago',
    },
    {
      id: 7,
      asset: 'VALE3',
      type: 'Stock',
      category: 'BR Stocks',
      confidence: 82,
      sources: 4,
      prediction: 'Bullish',
      timeframe: '2-4 weeks',
      lastUpdated: '6 hours ago',
    },
    {
      id: 8,
      asset: 'ETH',
      type: 'Crypto',
      category: 'Cryptocurrencies',
      confidence: 87,
      sources: 4,
      prediction: 'Bullish',
      timeframe: '1-2 weeks',
      lastUpdated: '2 hours ago',
    },
  ];

  // Filter opportunities based on selected categories
  const filteredOpportunities = selectedCategories.length === 0
    ? mockOpportunities
    : mockOpportunities.filter(opp => selectedCategories.includes(opp.category));

  const mockConflicts = [
    {
      id: 1,
      asset: 'NVDA',
      bullishSources: 2,
      bearishSources: 3,
      lastUpdated: '3 hours ago',
    },
    {
      id: 2,
      asset: 'ETH',
      bullishSources: 3,
      bearishSources: 2,
      lastUpdated: '6 hours ago',
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-2 text-gray-400">
          Overview of market insights and high-confidence opportunities
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Opportunities"
          value={12}
          change={8.3}
          icon={
            <div className="p-3 bg-blue-500/20 rounded-full">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          }
        />
        <StatCard
          title="Tracked Sources"
          value={8}
          icon={
            <div className="p-3 bg-green-500/20 rounded-full">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          }
        />
        <StatCard
          title="Avg Confidence"
          value="82%"
          change={3.2}
          icon={
            <div className="p-3 bg-purple-500/20 rounded-full">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          }
        />
        <StatCard
          title="Alerts Today"
          value={5}
          change={-12.5}
          icon={
            <div className="p-3 bg-yellow-500/20 rounded-full">
              <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* High Confidence Opportunities */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="High Confidence Opportunities"
              subtitle="Opportunities with 3+ sources agreeing"
              action={
                <button className="text-sm text-blue-400 hover:text-blue-300">
                  View All →
                </button>
              }
            />
            <CardBody className="p-0">
              {/* Category Filter */}
              <div className="px-6 pt-4 pb-2">
                <CategoryFilter
                  selectedCategories={selectedCategories}
                  onCategoryChange={setSelectedCategories}
                  opportunities={mockOpportunities}
                />
              </div>

              <div className="divide-y divide-gray-700">
                {filteredOpportunities.length > 0 ? (
                  filteredOpportunities.map((opp) => (
                    <div key={opp.id} className="px-6 py-4 hover:bg-gray-700/50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-semibold text-white">{opp.asset}</span>
                          <Badge variant="neutral" size="sm">{opp.category}</Badge>
                          <Badge
                            variant={opp.prediction === 'Bullish' ? 'success' : 'danger'}
                            size="sm"
                          >
                            {opp.prediction}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-white">{opp.confidence}%</div>
                          <div className="text-xs text-gray-400">Confidence</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-gray-400">
                          <span className="text-blue-400">{opp.sources} sources</span> • {opp.timeframe}
                        </div>
                        <div className="text-gray-500 text-xs">{opp.lastUpdated}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center text-gray-400">
                    No opportunities found for selected categories
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Conflicts */}
        <div>
          <Card>
            <CardHeader
              title="Source Conflicts"
              subtitle="Diverging predictions"
            />
            <CardBody className="p-0">
              <div className="divide-y divide-gray-700">
                {mockConflicts.map((conflict) => (
                  <div key={conflict.id} className="px-6 py-4 hover:bg-gray-700/50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-white">{conflict.asset}</span>
                      <Badge variant="warning" size="sm">Conflict</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-400">Bullish</span>
                        <span className="text-gray-400">{conflict.bullishSources} sources</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-red-400">Bearish</span>
                        <span className="text-gray-400">{conflict.bearishSources} sources</span>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-500">{conflict.lastUpdated}</div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader title="Quick Actions" />
            <CardBody className="space-y-2">
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
                Add New Source
              </button>
              <button className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">
                Configure Alerts
              </button>
              <button className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">
                Export Report
              </button>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader title="Recent Activity" subtitle="Latest updates from tracked sources" />
        <CardBody className="p-0">
          <div className="divide-y divide-gray-700">
            <div className="px-6 py-4 flex items-start space-x-4">
              <div className="p-2 bg-blue-500/20 rounded-full">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">New prediction added for <span className="font-semibold">MSFT</span></p>
                <p className="text-sm text-gray-400 mt-1">Source: Bloomberg Analysis • 85% confidence</p>
                <p className="text-xs text-gray-500 mt-2">15 minutes ago</p>
              </div>
            </div>
            <div className="px-6 py-4 flex items-start space-x-4">
              <div className="p-2 bg-yellow-500/20 rounded-full">
                <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">Source conflict detected for <span className="font-semibold">NVDA</span></p>
                <p className="text-sm text-gray-400 mt-1">3 bullish vs 2 bearish predictions</p>
                <p className="text-xs text-gray-500 mt-2">1 hour ago</p>
              </div>
            </div>
            <div className="px-6 py-4 flex items-start space-x-4">
              <div className="p-2 bg-green-500/20 rounded-full">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white">Correlation detected: <span className="font-semibold">BTC</span></p>
                <p className="text-sm text-gray-400 mt-1">5 sources predicting bullish trend</p>
                <p className="text-xs text-gray-500 mt-2">3 hours ago</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
      </div>
    </div>
  );
}
