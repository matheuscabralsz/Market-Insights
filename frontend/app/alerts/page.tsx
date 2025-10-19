'use client';

import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useState } from 'react';

export default function Alerts() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'settings'>('all');

  // Mock data - will be replaced with real data later
  const mockAlerts = [
    {
      id: 1,
      type: 'correlation',
      title: 'High Confidence Opportunity Detected',
      message: 'BTC shows bullish correlation across 5 sources with 92% confidence',
      asset: 'BTC',
      confidence: 92,
      sources: 5,
      timestamp: '10 mins ago',
      read: false,
      priority: 'high',
    },
    {
      id: 2,
      type: 'conflict',
      title: 'Source Conflict Detected',
      message: 'NVDA has diverging predictions: 3 bullish vs 2 bearish sources',
      asset: 'NVDA',
      timestamp: '1 hour ago',
      read: false,
      priority: 'medium',
    },
    {
      id: 3,
      type: 'update',
      title: 'New Prediction Added',
      message: 'Bloomberg Analysis added new AAPL prediction with 85% confidence',
      asset: 'AAPL',
      source: 'Bloomberg Analysis',
      timestamp: '2 hours ago',
      read: true,
      priority: 'low',
    },
    {
      id: 4,
      type: 'accuracy',
      title: 'Source Accuracy Update',
      message: 'WSJ accuracy improved to 91% (+3% this month)',
      source: 'Wall Street Journal',
      timestamp: '5 hours ago',
      read: true,
      priority: 'low',
    },
    {
      id: 5,
      type: 'correlation',
      title: 'Strong Consensus Detected',
      message: 'ETH shows bullish trend with 4 sources agreeing (88% confidence)',
      asset: 'ETH',
      confidence: 88,
      sources: 4,
      timestamp: '1 day ago',
      read: true,
      priority: 'high',
    },
  ];

  const filteredAlerts = activeTab === 'unread'
    ? mockAlerts.filter(a => !a.read)
    : mockAlerts;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'correlation':
        return (
          <div className="p-2 bg-green-500/20 rounded-full">
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'conflict':
        return (
          <div className="p-2 bg-yellow-500/20 rounded-full">
            <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'update':
        return (
          <div className="p-2 bg-blue-500/20 rounded-full">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        );
      case 'accuracy':
        return (
          <div className="p-2 bg-purple-500/20 rounded-full">
            <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Alerts & Notifications</h1>
        <p className="mt-2 text-gray-400">
          Stay updated on market opportunities and source updates
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardBody className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Total Alerts</div>
              <div className="text-2xl font-bold text-white mt-1">{mockAlerts.length}</div>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-full">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Unread</div>
              <div className="text-2xl font-bold text-white mt-1">
                {mockAlerts.filter(a => !a.read).length}
              </div>
            </div>
            <div className="p-3 bg-green-500/20 rounded-full">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">High Priority</div>
              <div className="text-2xl font-bold text-white mt-1">
                {mockAlerts.filter(a => a.priority === 'high').length}
              </div>
            </div>
            <div className="p-3 bg-red-500/20 rounded-full">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          All Alerts
        </button>
        <button
          onClick={() => setActiveTab('unread')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'unread'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Unread
          {mockAlerts.filter(a => !a.read).length > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
              {mockAlerts.filter(a => !a.read).length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'settings'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Settings
        </button>
      </div>

      {/* Alerts List */}
      {activeTab !== 'settings' && (
        <Card>
          <CardHeader
            title={activeTab === 'all' ? 'All Alerts' : 'Unread Alerts'}
            action={
              <button className="text-sm text-blue-400 hover:text-blue-300">
                Mark all as read
              </button>
            }
          />
          <CardBody className="p-0">
            <div className="divide-y divide-gray-700">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`px-6 py-4 hover:bg-gray-700/30 transition-colors cursor-pointer ${
                    !alert.read ? 'bg-blue-500/5 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-sm font-semibold text-white">{alert.title}</h3>
                          {alert.priority === 'high' && (
                            <Badge variant="danger" size="sm" className="mt-1">High Priority</Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                          {alert.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{alert.message}</p>
                      <div className="flex items-center gap-3 text-xs">
                        {alert.asset && (
                          <span className="text-blue-400 font-medium">{alert.asset}</span>
                        )}
                        {alert.confidence && (
                          <span className="text-gray-400">{alert.confidence}% confidence</span>
                        )}
                        {alert.sources && (
                          <span className="text-gray-400">{alert.sources} sources</span>
                        )}
                        {alert.source && (
                          <span className="text-gray-400">Source: {alert.source}</span>
                        )}
                      </div>
                    </div>
                    {!alert.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="Notification Preferences" subtitle="Configure when to receive alerts" />
            <CardBody className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-white">High Confidence Opportunities</div>
                  <div className="text-xs text-gray-400">Alert when 3+ sources agree (80%+ confidence)</div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-white">Source Conflicts</div>
                  <div className="text-xs text-gray-400">Alert when sources have opposing views</div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-white">New Predictions</div>
                  <div className="text-xs text-gray-400">Alert for every new prediction added</div>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-white">Accuracy Updates</div>
                  <div className="text-xs text-gray-400">Alert when source accuracy changes significantly</div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800"
                />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Alert Channels" subtitle="Choose how to receive notifications" />
            <CardBody className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium text-white">Push Notifications</div>
                    <div className="text-xs text-gray-400">Browser push notifications</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium text-white">Email Notifications</div>
                    <div className="text-xs text-gray-400">Daily digest at 9:00 AM</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800"
                />
              </div>

              <div className="pt-4 border-t border-gray-700">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Minimum Confidence Level
                </label>
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  defaultValue="80"
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>50%</span>
                  <span className="font-medium text-white">80%</span>
                  <span>95%</span>
                </div>
              </div>

              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors mt-4">
                Save Settings
              </button>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
