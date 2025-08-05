'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Calendar, Sun, Moon } from 'lucide-react'

export default function ModernTimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!isClient) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center space-x-3">
          <Clock className="h-6 w-6" />
          <div>
            <p className="text-sm opacity-90">Loading...</p>
            <p className="text-lg font-semibold">--:--:--</p>
          </div>
        </div>
      </div>
    )
  }

  const timeString = currentTime.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  const dateString = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const isDaytime = currentTime.getHours() >= 6 && currentTime.getHours() < 18

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-20 h-20 bg-white rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-white rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              <Clock className="h-6 w-6" />
            </motion.div>
            <div>
              <p className="text-sm opacity-90">Current Time</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={timeString}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-2xl font-bold font-mono"
                >
                  {timeString}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
          
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-2 bg-white/20 rounded-lg"
          >
            {isDaytime ? (
              <Sun className="h-5 w-5 text-yellow-300" />
            ) : (
              <Moon className="h-5 w-5 text-blue-200" />
            )}
          </motion.div>
        </div>

        <div className="flex items-center space-x-3">
          <Calendar className="h-4 w-4 opacity-80" />
          <motion.p
            key={dateString}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm opacity-90"
          >
            {dateString}
          </motion.p>
        </div>

        {/* Time zone indicator */}
        <div className="mt-3 pt-3 border-t border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-xs opacity-75">Timezone</span>
            <span className="text-xs font-medium">
              {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </span>
          </div>
        </div>
      </div>

      {/* Floating particles */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-2 right-8 w-1 h-1 bg-white rounded-full opacity-60"
      />
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        className="absolute bottom-4 right-16 w-1 h-1 bg-white rounded-full opacity-40"
      />
    </motion.div>
  )
} 