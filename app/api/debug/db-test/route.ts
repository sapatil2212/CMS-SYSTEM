import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger';
import {  prisma  } from '@/lib/db';

export async function GET() {
  try {
    logger.log('Database connection test started')
    
    // Test basic database connection
    const result = await prisma.$queryRaw`SELECT 1 as test`
    logger.log('Basic connection test passed:', result)
    
    // Test header menu items table
    const menuItemsCount = await prisma.headerMenuItem.count()
    logger.log('Header menu items count:', menuItemsCount)
    
    // Test process activation tables
    const copperPlatingCount = await prisma.copperPlatingContent.count()
    const silverPlatingCount = await prisma.silverPlatingContent.count()
    const goldPlatingCount = await prisma.goldPlatingContent.count()
    
    logger.log('Process content counts:', {
      copperPlating: copperPlatingCount,
      silverPlating: silverPlatingCount,
      goldPlating: goldPlatingCount
    })
    
    // Test a simple query from header menu items
    const menuItems = await prisma.headerMenuItem.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        href: true,
        isActive: true
      }
    })
    
    logger.log('Sample menu items:', menuItems)
    
    return NextResponse.json({
      success: true,
      message: 'Database connection test passed',
      data: {
        basicConnection: 'OK',
        menuItemsCount,
        processCounts: {
          copperPlating: copperPlatingCount,
          silverPlating: silverPlatingCount,
          goldPlating: goldPlatingCount
        },
        sampleMenuItems: menuItems
      }
    })
  } catch (error) {
    logger.error('Database connection test failed:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Database connection test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}