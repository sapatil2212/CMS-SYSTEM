import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { process: string } }
) {
  try {
    const { process } = params
    
    // Map process slug to Prisma model
    const processModelMap: { [key: string]: string } = {
      'copper-plating': 'copperPlatingContent',
      'silver-plating': 'silverPlatingContent',
      'gold-plating': 'goldPlatingContent',
      'nickel-plating': 'nickelPlatingContent',
      'electroless-nickel-plating': 'electrolessNickelPlatingContent',
      'zinc-plating': 'zincPlatingContent',
      'bright-tin-plating': 'brightTinPlatingContent',
      'dull-tin-plating': 'dullTinPlatingContent',
      'busbar-plating': 'busbarPlatingContent',
      'rack-barrel-plating': 'rackBarrelPlatingContent',
      'zinc-flake-coating': 'zincFlakeCoatingContent',
      'molykote': 'molykoteContent',
      // Base metals
      'aluminium': 'aluminiumContent',
      'copper': 'copperContent',
      'brass': 'brassContent',
      'stainless-steel': 'stainlessSteelContent',
      'carbon-steel': 'carbonSteelContent'
    }

    // Check if this is a base metal by looking it up in BaseMetalSettings
    const baseMetalSetting = await prisma.baseMetalSettings.findUnique({
      where: { slug: process }
    })

    let modelName = processModelMap[process]
    
    // If it's a base metal but not in the hardcoded map, create the model name dynamically
    if (!modelName && baseMetalSetting) {
      // Convert slug to camelCase for model name (e.g., 'stainless-steel' -> 'stainlessSteelContent')
      const camelCaseSlug = process.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
      modelName = `${camelCaseSlug}Content`
    }

    if (!modelName) {
      return NextResponse.json({ error: 'Process not found' }, { status: 404 })
    }

    // Check if the model exists in Prisma
    try {
      // Test if the model exists by trying to access it
      await (prisma as any)[modelName].findFirst()
    } catch (error) {
      // If the model doesn't exist, return default content structure
      if (baseMetalSetting) {
        console.log(`Model ${modelName} doesn't exist, returning default content for ${process}`)
        return NextResponse.json({
          heroTitle: `${baseMetalSetting.name} Plating Services`,
          heroSubtitle: `Professional ${baseMetalSetting.name} Plating Solutions`,
          heroDescription: `High-quality ${baseMetalSetting.name.toLowerCase()} plating services for industrial applications`,
          heroImage: `/uploads/${process}/hero-${process}-plating.jpg`,
          whatIsTitle: `What is ${baseMetalSetting.name} Plating?`,
          whatIsDescription: `${baseMetalSetting.name} plating involves depositing a layer of ${baseMetalSetting.name.toLowerCase()} onto various substrates for enhanced properties and performance.`,
          whatIsImage: `/uploads/${process}/${process}-process.jpg`,
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
          qualityImage: `/uploads/${process}/quality-testing.jpg`,
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
            { title: "Industrial Components", image: `/uploads/${process}/industrial-components.jpg`, items: ["Machine parts", "Equipment components", "Industrial hardware", "Manufacturing tools"] },
            { title: "Automotive Parts", image: `/uploads/${process}/automotive-parts.jpg`, items: ["Engine components", "Transmission parts", "Suspension systems", "Electrical systems"] },
            { title: "Electronics", image: `/uploads/${process}/electronics.jpg`, items: ["Circuit boards", "Connectors", "Heat sinks", "RF components"] }
          ],
          industries: [
            { name: "Manufacturing", icon: "Factory", examples: ["Industrial equipment", "Machine tools", "Production systems"], image: `/uploads/${process}/manufacturing-industry.jpg` },
            { name: "Automotive", icon: "Car", examples: ["Vehicle components", "Engine parts", "Electrical systems"], image: `/uploads/${process}/automotive-industry.jpg` },
            { name: "Electronics", icon: "CircuitBoard", examples: ["Consumer electronics", "Industrial electronics", "Telecommunications"], image: `/uploads/${process}/electronics-industry.jpg` },
            { name: "Aerospace", icon: "Shield", examples: ["Aircraft components", "Satellite parts", "Avionics systems"], image: `/uploads/${process}/aerospace-industry.jpg` }
          ],
          qualityChecks: [
            { title: "Thickness Control", description: "Precision measurement for uniform coating thickness" },
            { title: "Adhesion Testing", description: "Bond strength verification through standardized test methods" },
            { title: "Corrosion Resistance", description: "Salt spray testing and environmental exposure verification" },
            { title: "Surface Quality", description: "Visual inspection and surface finish verification" }
          ]
        })
      }
      return NextResponse.json({ error: 'Process not found' }, { status: 404 })
    }

    // Use dynamic Prisma query
    const content = await (prisma as any)[modelName].findFirst({
      include: {
        benefits: {
          orderBy: { order: 'asc' }
        },
        processSteps: {
          orderBy: { order: 'asc' }
        },
        applications: {
          orderBy: { order: 'asc' }
        },
        industries: {
          orderBy: { order: 'asc' }
        },
        qualityChecks: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    // Parse JSON strings back to arrays for frontend consumption
    const parsedContent = {
      ...content,
      applications: content.applications?.map((app: any) => ({
        ...app,
        items: typeof app.items === 'string' ? JSON.parse(app.items) : app.items
      })) || [],
      industries: content.industries?.map((industry: any) => ({
        ...industry,
        examples: typeof industry.examples === 'string' ? JSON.parse(industry.examples) : industry.examples
      })) || []
    }

    return NextResponse.json(parsedContent)
  } catch (error) {
    console.error(`Error fetching ${params.process} content:`, error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { process: string } }
) {
  try {
    const { process } = params
    const body = await request.json()
    
    console.log(`Processing ${process} content update...`)
    
    // Map process slug to Prisma model
    const processModelMap: { [key: string]: string } = {
      'copper-plating': 'copperPlatingContent',
      'silver-plating': 'silverPlatingContent',
      'gold-plating': 'goldPlatingContent',
      'nickel-plating': 'nickelPlatingContent',
      'electroless-nickel-plating': 'electrolessNickelPlatingContent',
      'zinc-plating': 'zincPlatingContent',
      'bright-tin-plating': 'brightTinPlatingContent',
      'dull-tin-plating': 'dullTinPlatingContent',
      'busbar-plating': 'busbarPlatingContent',
      'rack-barrel-plating': 'rackBarrelPlatingContent',
      'zinc-flake-coating': 'zincFlakeCoatingContent',
      'molykote': 'molykoteContent',
      // Base metals
      'aluminium': 'aluminiumContent',
      'copper': 'copperContent',
      'brass': 'brassContent',
      'stainless-steel': 'stainlessSteelContent',
      'carbon-steel': 'carbonSteelContent'
    }

    // Check if this is a base metal by looking it up in BaseMetalSettings
    const baseMetalSetting = await prisma.baseMetalSettings.findUnique({
      where: { slug: process }
    })

    let modelName = processModelMap[process]
    
    // If it's a base metal but not in the hardcoded map, create the model name dynamically
    if (!modelName && baseMetalSetting) {
      // Convert slug to camelCase for model name (e.g., 'stainless-steel' -> 'stainlessSteelContent')
      const camelCaseSlug = process.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
      modelName = `${camelCaseSlug}Content`
      console.log(`Dynamic base metal model: ${modelName}`)
    }

    if (!modelName) {
      console.log(`Process not found: ${process}`)
      return NextResponse.json({ error: 'Process not found' }, { status: 404 })
    }

    // Check if the model exists in Prisma
    let modelExists = true
    try {
      // Test if the model exists by trying to access it
      await (prisma as any)[modelName].findFirst()
    } catch (error) {
      modelExists = false
      console.log(`Model ${modelName} doesn't exist for ${process}`)
    }

    // If it's a new base metal and the model doesn't exist, we can't save content yet
    if (!modelExists && baseMetalSetting) {
      console.log(`Cannot save content for ${process} - model ${modelName} doesn't exist in database`)
      return NextResponse.json({ 
        error: 'Content model not available for this base metal yet. Please contact administrator to add the required database models.',
        details: `Model ${modelName} needs to be added to the database schema`
      }, { status: 400 })
    }

    console.log(`Using model: ${modelName}`)

    // Check if content exists
    const existingContent = await (prisma as any)[modelName].findFirst()
    console.log(`Existing content found: ${!!existingContent}`)

    // Use Prisma transaction for better Railway database handling
    const result = await prisma.$transaction(async (tx) => {
      // Prepare main content data (without relationships)
      const mainContentData = {
        heroTitle: body.heroTitle || '',
        heroSubtitle: body.heroSubtitle || '',
        heroDescription: body.heroDescription || '',
        heroImage: body.heroImage || '',
        whatIsTitle: body.whatIsTitle || '',
        whatIsDescription: body.whatIsDescription || '',
        whatIsImage: body.whatIsImage || '',
        whatIsBestFor: body.whatIsBestFor || '',
        whatIsMaterials: body.whatIsMaterials || '',
        whatIsAlkalineOffers: body.whatIsAlkalineOffers || '',
        benefitsTitle: body.benefitsTitle || '',
        benefitsSubtitle: body.benefitsSubtitle || '',
        processTitle: body.processTitle || '',
        processSubtitle: body.processSubtitle || '',
        applicationsTitle: body.applicationsTitle || '',
        applicationsSubtitle: body.applicationsSubtitle || '',
        industriesTitle: body.industriesTitle || '',
        industriesSubtitle: body.industriesSubtitle || '',
        qualityTitle: body.qualityTitle || '',
        qualityDescription: body.qualityDescription || '',
        qualityImage: body.qualityImage || '',
        ctaTitle: body.ctaTitle || '',
        ctaDescription: body.ctaDescription || ''
      }

      let content
      if (existingContent) {
        // Update main content first
        content = await (tx as any)[modelName].update({
          where: { id: existingContent.id },
          data: mainContentData
        })
        console.log(`Updated existing content for ${process}`)
      } else {
        // Create main content first
        content = await (tx as any)[modelName].create({
          data: mainContentData
        })
        console.log(`Created new content for ${process}`)
      }

      // Handle related data separately to avoid Railway connection issues
      if (body.benefits && body.benefits.length > 0) {
        // Delete existing benefits
        await (tx as any)[`${modelName.replace('Content', 'Benefit')}`].deleteMany({
          where: { contentId: content.id }
        })
        
        // Create new benefits
        const benefitModel = `${modelName.replace('Content', 'Benefit')}`
        for (const [index, benefit] of body.benefits.entries()) {
          await (tx as any)[benefitModel].create({
            data: {
              contentId: content.id,
              icon: benefit.icon || '',
              title: benefit.title || '',
              description: benefit.description || '',
              order: index
            }
          })
        }
        console.log(`Updated ${body.benefits.length} benefits`)
      }

      // Handle process steps
      if (body.processSteps && body.processSteps.length > 0) {
        await (tx as any)[`${modelName.replace('Content', 'ProcessStep')}`].deleteMany({
          where: { contentId: content.id }
        })
        
        const stepModel = `${modelName.replace('Content', 'ProcessStep')}`
        for (const [index, step] of body.processSteps.entries()) {
          await (tx as any)[stepModel].create({
            data: {
              contentId: content.id,
              step: step.step || '',
              title: step.title || '',
              description: step.description || '',
              icon: step.icon || '',
              order: index
            }
          })
        }
        console.log(`Updated ${body.processSteps.length} process steps`)
      }

      // Handle applications
      if (body.applications && body.applications.length > 0) {
        await (tx as any)[`${modelName.replace('Content', 'Application')}`].deleteMany({
          where: { contentId: content.id }
        })
        
        const appModel = `${modelName.replace('Content', 'Application')}`
        for (const [index, app] of body.applications.entries()) {
          await (tx as any)[appModel].create({
            data: {
              contentId: content.id,
              title: app.title || '',
              image: app.image || '',
              items: JSON.stringify(app.items || []),
              order: index
            }
          })
        }
        console.log(`Updated ${body.applications.length} applications`)
      }

      // Handle industries
      if (body.industries && body.industries.length > 0) {
        await (tx as any)[`${modelName.replace('Content', 'Industry')}`].deleteMany({
          where: { contentId: content.id }
        })
        
        const industryModel = `${modelName.replace('Content', 'Industry')}`
        for (const [index, industry] of body.industries.entries()) {
          await (tx as any)[industryModel].create({
            data: {
              contentId: content.id,
              name: industry.name || '',
              icon: industry.icon || '',
              examples: JSON.stringify(industry.examples || []),
              image: industry.image || '',
              order: index
            }
          })
        }
        console.log(`Updated ${body.industries.length} industries`)
      }

      // Handle quality checks
      if (body.qualityChecks && body.qualityChecks.length > 0) {
        await (tx as any)[`${modelName.replace('Content', 'QualityCheck')}`].deleteMany({
          where: { contentId: content.id }
        })
        
        const qualityModel = `${modelName.replace('Content', 'QualityCheck')}`
        for (const [index, check] of body.qualityChecks.entries()) {
          await (tx as any)[qualityModel].create({
            data: {
              contentId: content.id,
              title: check.title || '',
              description: check.description || '',
              order: index
            }
          })
        }
        console.log(`Updated ${body.qualityChecks.length} quality checks`)
      }

      return content
    }, {
      maxWait: 10000, // 10 seconds
      timeout: 15000, // 15 seconds
    })

    // Fetch complete content with relationships for response
    const finalContent = await (prisma as any)[modelName].findFirst({
      where: { id: result.id },
      include: {
        benefits: { orderBy: { order: 'asc' } },
        processSteps: { orderBy: { order: 'asc' } },
        applications: { orderBy: { order: 'asc' } },
        industries: { orderBy: { order: 'asc' } },
        qualityChecks: { orderBy: { order: 'asc' } }
      }
    })

    console.log(`Successfully saved ${process} content`)
    return NextResponse.json(finalContent)

  } catch (error) {
    console.error(`Error saving ${params.process} content:`, error)
    
    // Provide more specific error information
    let errorMessage = 'Internal server error'
    if (error instanceof Error) {
      if (error.message.includes('P2002')) {
        errorMessage = 'Duplicate content detected'
      } else if (error.message.includes('P2025')) {
        errorMessage = 'Content not found'
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Database operation timed out'
      } else if (error.message.includes('connect')) {
        errorMessage = 'Database connection failed'
      }
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 