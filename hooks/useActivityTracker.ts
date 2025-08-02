import { useAuth } from '@/lib/auth-provider'

interface ActivityData {
  action: string
  target: string
  targetName: string
  details: string
  type: 'process' | 'base-metal' | 'content' | 'settings' | 'user'
}

export const useActivityTracker = () => {
  const { user } = useAuth()

  const trackActivity = async (activityData: ActivityData) => {
    if (!user) return

    try {
      await fetch('/api/admin/activity-track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          ...activityData
        }),
      })
    } catch (error) {
      console.error('Failed to track activity:', error)
    }
  }

  const trackProcessActivity = (action: string, processName: string, details?: string) => {
    trackActivity({
      action,
      target: 'process',
      targetName: processName,
      details: details || `${action} on ${processName}`,
      type: 'process'
    })
  }

  const trackBaseMetalActivity = (action: string, metalName: string, details?: string) => {
    trackActivity({
      action,
      target: 'base-metal',
      targetName: metalName,
      details: details || `${action} on ${metalName}`,
      type: 'base-metal'
    })
  }

  const trackContentActivity = (action: string, contentName: string, details?: string) => {
    trackActivity({
      action,
      target: 'content',
      targetName: contentName,
      details: details || `${action} on ${contentName}`,
      type: 'content'
    })
  }

  const trackSettingsActivity = (action: string, settingName: string, details?: string) => {
    trackActivity({
      action,
      target: 'settings',
      targetName: settingName,
      details: details || `${action} on ${settingName}`,
      type: 'settings'
    })
  }

  const trackUserActivity = (action: string, userName: string, details?: string) => {
    trackActivity({
      action,
      target: 'user',
      targetName: userName,
      details: details || `${action} on ${userName}`,
      type: 'user'
    })
  }

  return {
    trackActivity,
    trackProcessActivity,
    trackBaseMetalActivity,
    trackContentActivity,
    trackSettingsActivity,
    trackUserActivity
  }
} 