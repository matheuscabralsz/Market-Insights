'use client';

import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AccuracyChart } from '@/components/charts/AccuracyChart';

export default function Analytics() {
  // Mock chart data - will be replaced with real data later
  const accuracyOverTimeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Bloomberg',
        data: [82, 85, 83, 87, 88, 87],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      },
      {
        label: 'WSJ',
        data: [88, 89, 90, 91, 90, 91],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
      },
      {
        label: 'CoinDesk',
        data: [75, 76, 78, 79, 78, 79],
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
      },
    ],
  };

  const mockLeaderboard = [
    { rank: 1, name: 'Wall Street Journal', accuracy: 91, predictions: 98, trend: 'up' },
    { rank: 2, name: 'Bloomberg Analysis', accuracy: 87, predictions: 145, trend: 'up' },
    { rank: 3, name: 'The Block', accuracy: 82, predictions: 156, trend: 'stable' },
    { rank: 4, name: 'CoinDesk', accuracy: 79, predictions: 203, trend: 'down' },
    { rank: 5, name: 'Seeking Alpha', accuracy: 74, predictions: 312, trend: 'up' },
  ];

  const mockAssetPerformance = [
    { asset: 'BTC', predictions: 45, correct: 38, accuracy: 84, avgConfidence: 87 },
    { asset: 'AAPL', predictions: 52, correct: 43, accuracy: 83, avgConfidence: 82 },
    { asset: 'ETH', predictions: 38, correct: 31, accuracy: 82, avgConfidence: 85 },
    { asset: 'NVDA', predictions: 41, correct: 32, accuracy: 78, avgConfidence: 79 },
    { asset: 'TSLA', predictions: 48, correct: 36, accuracy: 75, avgConfidence: 73 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="mt-2 text-gray-400">
          Historical accuracy tracking and performance metrics
        </p>
      </div>

      {/* Accuracy Over Time Chart */}
      <Card className="mb-8">
        <CardHeader
          title="Source Accuracy Over Time"
          subtitle="6-month historical accuracy trends"
        />
        <CardBody>
          <div className="h-80">
            <AccuracyChart data={accuracyOverTimeData} />
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Source Leaderboard */}
        <Card>
          <CardHeader
            title="Source Leaderboard"
            subtitle="Ranked by prediction accuracy"
          />
          <CardBody className="p-0">
            <div className="divide-y divide-gray-700">
              {mockLeaderboard.map((source) => (
                <div key={source.rank} className="px-6 py-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-sm font-bold">
                      {source.rank}
                    </div>
                    <div>
                      <div className="font-medium text-white">{source.name}</div>
                      <div className="text-xs text-gray-400">{source.predictions} predictions</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {source.trend === 'up' && (
                      <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    )}
                    {source.trend === 'down' && (
                      <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    )}
                    {source.trend === 'stable' && (
                      <div className="w-4 h-0.5 bg-gray-400"></div>
                    )}
                    <span className="text-lg font-bold text-white">{source.accuracy}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Asset Performance */}
        <Card>
          <CardHeader
            title="Asset Performance"
            subtitle="Accuracy by asset"
          />
          <CardBody className="p-0">
            <div className="divide-y divide-gray-700">
              {mockAssetPerformance.map((asset) => (
                <div key={asset.asset} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">{asset.asset}</span>
                    <span className="text-sm text-gray-400">
                      {asset.correct}/{asset.predictions} correct
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            asset.accuracy >= 80
                              ? 'bg-green-500'
                              : asset.accuracy >= 75
                              ? 'bg-blue-500'
                              : 'bg-yellow-500'
                          }`}
                          style={{ width: `${asset.accuracy}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{asset.accuracy}%</span>
                      <Badge variant="info" size="sm">
                        {asset.avgConfidence}% conf
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Best Performing Category</div>
                <div className="text-xl font-bold text-white">Financial News</div>
                <div className="text-sm text-green-400 mt-1">89% avg accuracy</div>
              </div>
              <div className="p-3 bg-green-500/20 rounded-full">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Most Improved Source</div>
                <div className="text-xl font-bold text-white">Seeking Alpha</div>
                <div className="text-sm text-blue-400 mt-1">+12% this month</div>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-full">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Consensus Rate</div>
                <div className="text-xl font-bold text-white">68%</div>
                <div className="text-sm text-gray-400 mt-1">3+ sources agree</div>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-full">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
