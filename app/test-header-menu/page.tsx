'use client'

import { useState, useEffect } from 'react'
import HeaderMenuManagement from '@/components/admin/HeaderMenuManagement'

export default function TestHeaderMenu() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Test Header Menu Management</h1>
        <HeaderMenuManagement />
      </div>
    </div>
  )
} 