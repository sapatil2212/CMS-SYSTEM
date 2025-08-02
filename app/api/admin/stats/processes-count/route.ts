import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get count of processes that are active in the frontend dropdown (isMenuActive: true)
    const processesCount = await Promise.all([
      prisma.copperPlatingContent.findFirst().then(content => content?.isMenuActive ? 1 : 0),
      prisma.silverPlatingContent.findFirst().then(content => content?.isMenuActive ? 1 : 0),
      prisma.goldPlatingContent.findFirst().then(content => content?.isMenuActive ? 1 : 0),
      prisma.busbarPlatingContent.findFirst().then(content => content?.isMenuActive ? 1 : 0),
      prisma.zincPlatingContent.findFirst().then(content => content?.isMenuActive ? 1 : 0),
      prisma.nickelPlatingContent.findFirst().then(content => content?.isMenuActive ? 1 : 0),
      prisma.electrolessNickelPlatingContent.findFirst().then(content => content?.isMenuActive ? 1 : 0),
      prisma.brightTinPlatingContent.findFirst().then(content => content?.isMenuActive ? 1 : 0),
      prisma.dullTinPlatingContent.findFirst().then(content => content?.isMenuActive ? 1 : 0),
      prisma.rackBarrelPlatingContent.findFirst().then(content => content?.isMenuActive ? 1 : 0),
      prisma.zincFlakeCoatingContent.findFirst().then(content => content?.isMenuActive ? 1 : 0),
      prisma.molykoteContent.findFirst().then(content => content?.isMenuActive ? 1 : 0)
    ])

    const totalActiveProcesses = processesCount.reduce((sum, count) => sum + count, 0)

    return NextResponse.json({
      count: totalActiveProcesses
    })
  } catch (error) {
    console.error('Error fetching processes count:', error)
    return NextResponse.json(
      { error: 'Failed to fetch processes count' },
      { status: 500 }
    )
  }
} 