'use client';

import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useState } from 'react';

export default function Opportunities() {
  const [filter, setFilter] = useState<'all' | 'bullish' | 'bearish'>('all');
  const [sortBy, setSortBy] = useState<'confidence' | 'sources' | 'recent'>('confidence');

  // Mock data - will be replaced with real data later
  const mockOpportunities = [
    {
      id: 1,
      asset: 'AAPL',
      type: 'Stock',
      confidence: 85,
      sources: 4,
      prediction: 'Bullish',
      timeframe: '1-3 months',
      targetPrice: '$195',
      currentPrice: '$178',
      potentialGain: '+9.5%',
      lastUpdated: '2 hours ago',
      description: 'Strong institutional buying and positive earnings outlook.',
      sourcesDetail: ['Bloomberg', 'WSJ', 'Motley Fool', 'Seeking Alpha'],
    },
    {
      id: 2,
      asset: 'BTC',
      type: 'Crypto',
      confidence: 92,
      sources: 5,
      prediction: 'Bullish',
      timeframe: '1-2 weeks',
      targetPrice: '$52,000',
      currentPrice: '$47,500',
      potentialGain: '+9.5%',
      lastUpdated: '4 hours ago',
      description: 'Halving event approaching, increasing institutional adoption.',
      sourcesDetail: ['CoinDesk', 'Crypto Briefing', 'The Block', 'Messari', 'Glassnode'],
    },
    {
      id: 3,
      asset: 'TSLA',
      type: 'Stock',
      confidence: 78,
      sources: 3,
      prediction: 'Bearish',
      timeframe: '2-4 weeks',
      targetPrice: '$195',
      currentPrice: '$208',
      potentialGain: '-6.3%',
      lastUpdated: '1 day ago',
      description: 'Competition increasing, margins under pressure.',
      sourcesDetail: ['CNBC', 'MarketWatch', 'Barron\'s'],
    },
    {
      id: 4,
      asset: 'ETH',
      type: 'Crypto',
      confidence: 88,
      sources: 4,
      prediction: 'Bullish',
      timeframe: '3-6 months',
      targetPrice: '$3,200',
      currentPrice: '$2,750',
      potentialGain: '+16.4%',
      lastUpdated: '5 hours ago',
      description: 'ETF approval momentum, network upgrades showing promise.',
      sourcesDetail: ['CoinDesk', 'The Block', 'Decrypt', 'Crypto Briefing'],
    },
    {
      id: 5,
      asset: 'NVDA',
      type: 'Stock',
      confidence: 82,
      sources: 5,
      prediction: 'Bullish',
      timeframe: '1-2 months',
      targetPrice: '$910',
      currentPrice: '$875',
      potentialGain: '+4.0%',
      lastUpdated: '3 hours ago',
      description: 'AI demand continues to surge, data center growth strong.',
      sourcesDetail: ['Bloomberg', 'Reuters', 'WSJ', 'The Information', 'Barron\'s'],
    },
  ];

  const filteredOpportunities = mockOpportunities.filter(opp => {
    if (filter === 'all') return true;
    return opp.prediction.toLowerCase() === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Market Opportunities</h1>
        <p className="mt-2 text-gray-400">
          High-confidence investment opportunities identified by multiple sources
        </p>
      </div>

      {/* Filters and Sort */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('bullish')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'bullish'
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Bullish
          </button>
          <button
            onClick={() => setFilter('bearish')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'bearish'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Bearish
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="confidence">Confidence</option>
            <option value="sources">Source Count</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOpportunities.map((opp) => (
          <Card key={opp.id} hover>
            <CardHeader
              title={
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold">{opp.asset}</span>
                  <Badge variant="neutral" size="sm">{opp.type}</Badge>
                  <Badge
                    variant={opp.prediction === 'Bullish' ? 'success' : 'danger'}
                    size="sm"
                  >
                    {opp.prediction}
                  </Badge>
                </div>
              }
              action={
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{opp.confidence}%</div>
                  <div className="text-xs text-gray-400">Confidence</div>
                </div>
              }
            />
            <CardBody>
              <div className="space-y-4">
                {/* Price Info */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-gray-400">Current</div>
                    <div className="text-sm font-semibold text-white">{opp.currentPrice}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Target</div>
                    <div className="text-sm font-semibold text-white">{opp.targetPrice}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Potential</div>
                    <div className={`text-sm font-semibold ${
                      opp.prediction === 'Bullish' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {opp.potentialGain}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-300">{opp.description}</p>

                {/* Sources */}
                <div>
                  <div className="text-xs text-gray-400 mb-2">
                    {opp.sources} sources agree • {opp.timeframe}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {opp.sourcesDetail.map((source, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-gray-700/50 rounded text-gray-300"
                      >
                        {source}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                  <span className="text-xs text-gray-500">{opp.lastUpdated}</span>
                  <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">
                    View Details →
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredOpportunities.length === 0 && (
        <Card>
          <CardBody className="text-center py-12">
            <div className="p-4 bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-400">No opportunities match your filter criteria</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
