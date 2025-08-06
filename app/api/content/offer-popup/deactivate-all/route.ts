import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger';
import {  prisma  } from '@/lib/db';

// POST - Deactivate all offer popups
export async function POST() {
  try {
    await prisma.offerPopup.updateMany({
      where: {
        isActive: true
      },
      data: {
        isActive: false
      }
    })

    return NextResponse.json({ message: 'All offer popups deactivated successfully' })
  } catch (error) {
    logger.error('Error deactivating offer popups:', error)
    return NextResponse.json(
      { error: 'Failed to deactivate offer popups' },
      { status: 500 }
    )
  }
} 