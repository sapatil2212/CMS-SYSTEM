import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { logger } from '@/lib/logger';
import {  HeaderMenuItem, HeaderMenuDropdownItem  } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    logger.log('🔍 Checking for duplicate menu items...')

    // Get all menu items
    const allMenuItems = await prisma.headerMenuItem.findMany({
      include: {
        dropdownItems: true
      },
      orderBy: { order: 'asc' }
    })

    logger.log(`📊 Found ${allMenuItems.length} total menu items`)

    // Group by name to find duplicates
    const menuItemsByName: Record<string, (HeaderMenuItem & { dropdownItems: HeaderMenuDropdownItem[] })[]> = {}
    const duplicates: (HeaderMenuItem & { dropdownItems: HeaderMenuDropdownItem[] })[] = []

    allMenuItems.forEach(item => {
      if (!menuItemsByName[item.name]) {
        menuItemsByName[item.name] = []
      }
      menuItemsByName[item.name].push(item)
    })

    // Find duplicates
    const duplicateGroups: {
      name: string;
      items: (HeaderMenuItem & { dropdownItems: HeaderMenuDropdownItem[] })[];
      duplicates: (HeaderMenuItem & { dropdownItems: HeaderMenuDropdownItem[] })[];
    }[] = []
    Object.keys(menuItemsByName).forEach(name => {
      const items = menuItemsByName[name]
      if (items.length > 1) {
        logger.log(`⚠️ Found ${items.length} duplicate items for "${name}":`)
        items.forEach((item, index) => {
          logger.log(`   ${index + 1}. ID: ${item.id}, Order: ${item.order}, Active: ${item.isActive}`)
        })
        duplicateGroups.push({
          name,
          items: items,
          duplicates: items.slice(1) // Keep the first one, mark others as duplicates
        })
        duplicates.push(...items.slice(1))
      }
    })

    if (duplicates.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No duplicate menu items found',
        summary: {
          totalMenuItems: allMenuItems.length,
          activeMenuItems: allMenuItems.filter(item => item.isActive).length,
          duplicatesFound: 0
        }
      })
    }

    logger.log(`\n🗑️ Found ${duplicates.length} duplicate menu items to remove:`)
    duplicates.forEach(item => {
      logger.log(`   - ${item.name} (ID: ${item.id})`)
    })

    // Remove duplicates
    logger.log('\n🗑️ Removing duplicate menu items...')
    const removedItems: {
      id: string;
      name: string;
      dropdownItemsRemoved: number;
    }[] = []
    for (const duplicate of duplicates) {
      // Delete dropdown items first (due to foreign key constraint)
      const deletedDropdownItems = await prisma.headerMenuDropdownItem.deleteMany({
        where: { menuItemId: duplicate.id }
      })

      // Delete the menu item
      const deletedMenuItem = await prisma.headerMenuItem.delete({
        where: { id: duplicate.id }
      })

      removedItems.push({
        id: duplicate.id,
        name: duplicate.name,
        dropdownItemsRemoved: deletedDropdownItems.count
      })

      logger.log(`   ✅ Removed duplicate: ${duplicate.name} (ID: ${duplicate.id})`)
    }

    // Verify the cleanup
    const remainingMenuItems = await prisma.headerMenuItem.findMany({
      include: {
        dropdownItems: true
      },
      orderBy: { order: 'asc' }
    })

    logger.log(`\n📊 After cleanup:`)
    logger.log(`   - Total menu items: ${remainingMenuItems.length}`)
    logger.log(`   - Active menu items: ${remainingMenuItems.filter(item => item.isActive).length}`)

    return NextResponse.json({
      success: true,
      message: 'Duplicate menu items removed successfully',
      summary: {
        totalMenuItems: remainingMenuItems.length,
        activeMenuItems: remainingMenuItems.filter(item => item.isActive).length,
        duplicatesFound: duplicates.length,
        removedItems: removedItems
      },
      remainingMenuItems: remainingMenuItems.map(item => ({
        id: item.id,
        name: item.name,
        order: item.order,
        isActive: item.isActive,
        dropdownItemsCount: item.dropdownItems.length
      }))
    })
  } catch (error) {
    logger.error('❌ Error removing duplicate menu items:', error)
    return NextResponse.json(
      { 
        error: 'Failed to remove duplicate menu items',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 