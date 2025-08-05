'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Plus, 
  Settings, 
  Users, 
  FileText, 
  Database, 
  BarChart3,
  Globe,
  Cog
} from 'lucide-react'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
  gradient: string
}

const quickActions: QuickAction[] = [
  {
    id: 'sectors',
    title: 'Manage Sectors',
    description: 'Add, edit, or remove industry sectors',
    icon: <Globe className="h-6 w-6" />,
    href: '/admin/sectors',
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'processes',
    title: 'Process Management',
    description: 'Configure plating processes and settings',
    icon: <Cog className="h-6 w-6" />,
    href: '/admin/processes',
    color: 'text-green-600',
    gradient: 'from-green-500 to-green-600'
  },
  {
    id: 'content',
    title: 'Content Editor',
    description: 'Manage website content and pages',
    icon: <FileText className="h-6 w-6" />,
    href: '/admin/content',
    color: 'text-purple-600',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    id: 'users',
    title: 'User Management',
    description: 'Manage user accounts and permissions',
    icon: <Users className="h-6 w-6" />,
    href: '/admin/users',
    color: 'text-orange-600',
    gradient: 'from-orange-500 to-orange-600'
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'View detailed analytics and reports',
    icon: <BarChart3 className="h-6 w-6" />,
    href: '/admin/analytics',
    color: 'text-indigo-600',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'settings',
    title: 'System Settings',
    description: 'Configure system preferences',
    icon: <Settings className="h-6 w-6" />,
    href: '/admin/settings',
    color: 'text-gray-600',
    gradient: 'from-gray-500 to-gray-600'
  }
]

export default function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          <p className="text-sm text-gray-600 mt-1">Access common tasks and features</p>
        </div>
        <div className="flex items-center space-x-2">
          <Plus className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-gray-600">Quick Access</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href={action.href}>
              <div className={`bg-gradient-to-r ${action.gradient} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                        {action.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{action.title}</h3>
                        <p className="text-white/80 text-sm">{action.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm font-medium opacity-90">Access Now</span>
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                        <Plus className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>


    </motion.div>
  )
} 