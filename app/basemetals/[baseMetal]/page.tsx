import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import DynamicBaseMetalComponent from '@/components/frontend/DynamicBaseMetalComponent'

interface PageProps {
  params: {
    baseMetal: string
  }
}

export async function generateStaticParams() {
  try {
    const baseMetals = await prisma.baseMetalSettings.findMany({
      where: { isActive: true },
      select: { slug: true }
    })

    return baseMetals.map((metal) => ({
      baseMetal: metal.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export default async function BaseMetalPage({ params }: PageProps) {
  const { baseMetal } = params

  try {
    // Check if this base metal exists and is active
    const baseMetalSetting = await prisma.baseMetalSettings.findUnique({
      where: { slug: baseMetal }
    })

    if (!baseMetalSetting || !baseMetalSetting.isActive) {
      notFound()
    }

    return <DynamicBaseMetalComponent baseMetalSlug={baseMetal} />
  } catch (error) {
    console.error(`Error loading ${baseMetal} page:`, error)
    notFound()
  }
} 