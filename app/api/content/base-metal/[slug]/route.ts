import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Check if this base metal exists in settings
    const baseMetalSetting = await prisma.baseMetalSettings.findUnique({
      where: { slug }
    })

    if (!baseMetalSetting) {
      return NextResponse.json({ error: 'Base metal not found' }, { status: 404 })
    }

    // Try to get saved content first
    const savedContent = await prisma.baseMetalContent.findUnique({
      where: { slug }
    })

    if (savedContent) {
      return NextResponse.json(savedContent.content)
    }

    // If no saved content, return default content structure
    const defaultContent = {
      heroTitle: `${baseMetalSetting.name} Plating Services`,
      heroSubtitle: `Professional ${baseMetalSetting.name} Plating Solutions`,
      heroDescription: `High-quality ${baseMetalSetting.name.toLowerCase()} plating services for industrial applications`,
      heroImage: `/uploads/${slug}/hero-${slug}-plating.jpg`,
      whatIsTitle: `What is ${baseMetalSetting.name} Plating?`,
      whatIsDescription: `${baseMetalSetting.name} plating involves depositing a layer of ${baseMetalSetting.name.toLowerCase()} onto various substrates for enhanced properties and performance.`,
      whatIsImage: `/uploads/${slug}/${slug}-process.jpg`,
      whatIsBestFor: `Industrial applications\nCorrosion resistance\nEnhanced durability\nPerformance improvement`,
      whatIsMaterials: `Steel substrates\nAluminum parts\nVarious metals\nComposite materials`,
      whatIsAlkalineOffers: `Our precision ${baseMetalSetting.name.toLowerCase()} plating delivers uniform finishes with excellent adhesion and performance characteristics.`,
      benefitsTitle: `Key Benefits of ${baseMetalSetting.name} Plating`,
      benefitsSubtitle: `Enhance your components with our specialized ${baseMetalSetting.name.toLowerCase()} plating solutions`,
      processTitle: `Our ${baseMetalSetting.name} Plating Process`,
      processSubtitle: `Precision techniques for consistent, high-quality ${baseMetalSetting.name.toLowerCase()} finishes`,
      applicationsTitle: `${baseMetalSetting.name} Plating Applications`,
      applicationsSubtitle: `Versatile solutions for various industrial requirements`,
      industriesTitle: `Industries We Serve`,
      industriesSubtitle: `${baseMetalSetting.name} plating solutions across diverse sectors`,
      qualityTitle: `Quality Assurance`,
      qualityDescription: `Each ${baseMetalSetting.name.toLowerCase()}-plated component is thoroughly tested for quality and performance to meet industry standards`,
      qualityImage: `/uploads/${slug}/quality-testing.jpg`,
      ctaTitle: `Ready to Enhance Your ${baseMetalSetting.name} Components?`,
      ctaDescription: `Our team is ready to discuss your specific plating requirements and provide a tailored solution`,
      benefits: [
        { icon: "Shield", title: "Enhanced Protection", description: "Superior corrosion resistance and durability" },
        { icon: "Zap", title: "Improved Performance", description: "Enhanced electrical and thermal properties" },
        { icon: "Layers", title: "Better Adhesion", description: "Excellent bonding and coating uniformity" },
        { icon: "Award", title: "Quality Finish", description: "Professional appearance and surface quality" },
        { icon: "Factory", title: "Industrial Grade", description: "Suitable for demanding applications" },
        { icon: "Thermometer", title: "Thermal Properties", description: "Enhanced heat resistance and conductivity" }
      ],
      processSteps: [
        { step: "1", title: "Surface Preparation", description: "Comprehensive cleaning and surface activation", icon: "ClipboardCheck" },
        { step: "2", title: "Base Layer", description: "Initial coating application for adhesion", icon: "Layers" },
        { step: "3", title: "Plating Process", description: "Controlled deposition in specialized baths", icon: "Zap" },
        { step: "4", title: "Quality Control", description: "Thorough testing and verification", icon: "Award" },
        { step: "5", title: "Final Finishing", description: "Protective coating and packaging", icon: "Package" }
      ],
      applications: [
        { title: "Industrial Components", image: `/uploads/${slug}/industrial-components.jpg`, items: ["Machine parts", "Equipment components", "Industrial hardware", "Manufacturing tools"] },
        { title: "Automotive Parts", image: `/uploads/${slug}/automotive-parts.jpg`, items: ["Engine components", "Transmission parts", "Suspension systems", "Electrical systems"] },
        { title: "Electronics", image: `/uploads/${slug}/electronics.jpg`, items: ["Circuit boards", "Connectors", "Heat sinks", "RF components"] }
      ],
      industries: [
        { name: "Manufacturing", icon: "Factory", examples: ["Industrial equipment", "Machine tools", "Production systems"], image: `/uploads/${slug}/manufacturing-industry.jpg` },
        { name: "Automotive", icon: "Car", examples: ["Vehicle components", "Engine parts", "Electrical systems"], image: `/uploads/${slug}/automotive-industry.jpg` },
        { name: "Electronics", icon: "CircuitBoard", examples: ["Consumer electronics", "Industrial electronics", "Telecommunications"], image: `/uploads/${slug}/electronics-industry.jpg` },
        { name: "Aerospace", icon: "Shield", examples: ["Aircraft components", "Satellite parts", "Avionics systems"], image: `/uploads/${slug}/aerospace-industry.jpg` }
      ],
      qualityChecks: [
        { title: "Thickness Control", description: "Precision measurement for uniform coating thickness" },
        { title: "Adhesion Testing", description: "Bond strength verification through standardized test methods" },
        { title: "Corrosion Resistance", description: "Salt spray testing and environmental exposure verification" },
        { title: "Surface Quality", description: "Visual inspection and surface finish verification" }
      ]
    }

    return NextResponse.json(defaultContent)
  } catch (error) {
    console.error(`Error fetching ${params.slug} content:`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const body = await request.json()

    // Check if this base metal exists in settings
    const baseMetalSetting = await prisma.baseMetalSettings.findUnique({
      where: { slug }
    })

    if (!baseMetalSetting) {
      return NextResponse.json({ error: 'Base metal not found' }, { status: 404 })
    }

    // Save or update content in the database
    const savedContent = await prisma.baseMetalContent.upsert({
      where: { slug },
      update: { content: body },
      create: { slug, content: body }
    })

    console.log(`Content saved successfully for ${slug}`)

    return NextResponse.json({
      message: 'Content saved successfully',
      slug: slug,
      name: baseMetalSetting.name,
      content: savedContent.content
    })

  } catch (error) {
    console.error(`Error saving ${params.slug} content:`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 