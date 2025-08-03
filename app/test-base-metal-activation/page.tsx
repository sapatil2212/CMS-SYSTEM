'use client'

import { useState, useEffect } from 'react'
import BaseMetalActivationManagement from '@/components/admin/BaseMetalActivationManagement'

export default function TestBaseMetalActivation() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Test Base Metal Activation</h1>
        <BaseMetalActivationManagement />
      </div>
    </div>
  )
} 