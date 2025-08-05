'use client'

import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Activity, PieChart } from 'lucide-react'

interface SimpleStatsProps {
  stats: {
    totalVisits: number
    baseMetalsCount: number
    processesCount: number
    sectorsCount?: number
    usersCount?: number
    contentCount?: number
  }
  chartView: 'area' | 'bar' | 'pie'
  setChartView: (view: 'area' | 'bar' | 'pie') => void
}

export default function SimpleStatsVisualization({ stats, chartView, setChartView }: SimpleStatsProps) {
  const chartData = [
    { name: 'Visits', value: stats.totalVisits, color: '#3B82F6', percentage: 35 },
    { name: 'Content', value: stats.contentCount || 0, color: '#EF4444', percentage: 25 },
    { name: 'Users', value: stats.usersCount || 0, color: '#10B981', percentage: 20 },
    { name: 'Processes', value: stats.processesCount * 10, color: '#F59E0B', percentage: 20 }
  ]

  const maxValue = Math.max(...chartData.map(d => d.value), 1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Analytics Overview</h3>
          <p className="text-sm text-gray-600">Real-time data visualization</p>
        </div>
        
        {/* Chart Type Selector */}
        <div className="flex space-x-2">
          <button
            onClick={() => setChartView('area')}
            className={`p-2 rounded-lg transition-all ${chartView === 'area' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Activity className="h-5 w-5" />
          </button>
          <button
            onClick={() => setChartView('bar')}
            className={`p-2 rounded-lg transition-all ${chartView === 'bar' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <BarChart3 className="h-5 w-5" />
          </button>
          <button
            onClick={() => setChartView('pie')}
            className={`p-2 rounded-lg transition-all ${chartView === 'pie' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <PieChart className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="h-64">
        {chartView === 'bar' && (
          <div className="h-full flex items-end justify-between space-x-4 px-4">
            {chartData.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ height: 0 }}
                animate={{ height: `${(item.value / maxValue) * 100}%` }}
                transition={{ duration: 1, delay: index * 0.2 }}
                className="flex-1 flex flex-col items-center"
              >
                <div
                  className="w-full rounded-t-lg mb-2"
                  style={{ 
                    backgroundColor: item.color,
                    height: `${Math.max((item.value / maxValue) * 100, 5)}%`,
                    minHeight: '20px'
                  }}
                />
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{item.value}</p>
                  <p className="text-xs text-gray-500">{item.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {chartView === 'pie' && (
          <div className="h-full flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="transform -rotate-90 w-full h-full">
                {chartData.map((item, index) => {
                  const circumference = 2 * Math.PI * 80
                  const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`
                  const strokeDashoffset = -chartData.slice(0, index).reduce((acc, d) => acc + (d.percentage / 100) * circumference, 0)
                  
                  return (
                    <circle
                      key={item.name}
                      cx="96"
                      cy="96"
                      r="80"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="16"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-1000"
                    />
                  )
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{stats.totalVisits}</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
              </div>
            </div>
            <div className="ml-8 space-y-2">
              {chartData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {chartView === 'area' && (
          <div className="h-full">
            <div className="grid grid-cols-2 gap-4 h-full">
              {chartData.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700">{item.name}</h4>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: item.color }}>
                      {item.value}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        className="h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}