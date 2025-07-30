import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding home processes...')

  const processes = [
    {
      title: "Silver Plating",
      description: "Highly Conductive, Durable & Versatile",
      content: "Silver is one of the best conductors of electricity and heat, making it a preferred choice in the electrical and connector industry. At Alkalyne, we offer silver plating from flash coatings to heavy build-ups up to 8mm.",
      image: "/uploads/processes/silver-plating.jpg",
      link: "/processes/silver-plating",
      order: 1,
      isActive: true
    },
    {
      title: "Gold Plating",
      description: "Resistant to Corrosion, Conductive by Nature",
      content: "Gold's unmatched corrosion and oxidation resistance make it an essential finish for critical electrical, aerospace, and telecom components.",
      image: "/uploads/processes/gold-plating.jpg",
      link: "/processes/gold-plating",
      order: 2,
      isActive: true
    },
    {
      title: "Electroless Nickel Plating (ENP)",
      description: "Uniform Coating Without Electricity",
      content: "Our ENP process applies a seamless layer of nickel using chemical reduction — perfect for intricate geometries and components requiring uniform protection.",
      image: "/uploads/processes/electroless-nickel.jpg",
      link: "/processes/electroless-nickel-plating",
      order: 3,
      isActive: true
    },
    {
      title: "Bright Tin Plating",
      description: "Lustrous Finish with Superior Conductivity",
      content: "Bright tin plating provides a clean, shiny surface while offering excellent electrical conductivity and corrosion protection.",
      image: "/uploads/processes/bright-tin.jpg",
      link: "/processes/bright-tin-plating",
      order: 4,
      isActive: true
    },
    {
      title: "Busbar Plating",
      description: "Conductivity Meets Durability",
      content: "We offer premium plating solutions for copper, aluminum, and CCA busbars.",
      image: "/uploads/processes/busbar-plating.jpg",
      link: "/processes/busbar-plating",
      order: 5,
      isActive: true
    },
    {
      title: "Copper Plating",
      description: "A Foundation for Function & Finish",
      content: "Copper plating enhances conductivity and serves as a strong base for further surface treatments.",
      image: "/uploads/processes/copper-plating.jpg",
      link: "/processes/copper-plating",
      order: 6,
      isActive: true
    },
    {
      title: "Manganese Phosphate Coating",
      description: "Exceptional Anti-Friction Properties",
      content: "Ideal for steel and iron alloys, this crystalline coating offers outstanding friction resistance.",
      image: "/uploads/processes/manganese-phosphate.jpg",
      link: "/processes/manganese-phosphate-coating",
      order: 7,
      isActive: true
    },
    {
      title: "Dull Tin Plating",
      description: "Whisker-Resistant & Matte Finished",
      content: "Dull tin plating reduces tin whiskering and provides corrosion resistance.",
      image: "/uploads/processes/dull-tin.jpg",
      link: "/processes/dull-tin-plating",
      order: 8,
      isActive: true
    },
    {
      title: "Iriditing (Chromate-Free Conversion Coating)",
      description: "Protective Coating for Aluminium Alloys",
      content: "Our iriditing process creates a heat- and corrosion-resistant surface on aluminum.",
      image: "/uploads/processes/iriditing.jpg",
      link: "/processes/iriditing",
      order: 9,
      isActive: true
    },
    {
      title: "Nickel Electroplating",
      description: "Robust & Uniform Metal Protection",
      content: "Nickel plating enhances hardness, ductility, and corrosion resistance.",
      image: "/uploads/processes/nickel-electroplating.jpg",
      link: "/processes/nickel-electroplating",
      order: 10,
      isActive: true
    },
    {
      title: "Zinc Plating & Colour Passivates",
      description: "Eco-Friendly Corrosion Shield",
      content: "Zinc plating offers corrosion protection through sacrificial coating.",
      image: "/uploads/processes/zinc-plating.jpg",
      link: "/processes/zinc-plating-colour-passivates",
      order: 11,
      isActive: true
    },
    {
      title: "OSP (Organic Solderability Preservative)",
      description: "Green Coating for Copper Pads",
      content: "OSP is a lead-free, eco-friendly coating used to protect copper pads during soldering.",
      image: "/uploads/processes/osp.jpg",
      link: "/processes/osp",
      order: 12,
      isActive: true
    },
    {
      title: "Rack & Barrel Plating",
      description: "Flexible Processing for All Sizes",
      content: "Choose between rack plating for delicate parts or barrel plating for bulk items.",
      image: "/uploads/processes/rack-barrel.jpg",
      link: "/processes/rack-barrel-plating",
      order: 13,
      isActive: true
    },
    {
      title: "Zinc Phosphating",
      description: "Lubricity + Corrosion Protection",
      content: "Zinc phosphate coatings act as adhesive layers for oils and waxes.",
      image: "/uploads/processes/zinc-phosphating.jpg",
      link: "/processes/zinc-phosphating",
      order: 14,
      isActive: true
    },
    {
      title: "Surface Cleaning & Blasting",
      description: "Pre-Treatment That Delivers Results",
      content: "We offer shot blasting, tumble blasting, ultrasonic cleaning, and degreasing.",
      image: "/uploads/processes/surface-cleaning.jpg",
      link: "/processes/surface-cleaning",
      order: 15,
      isActive: true
    }
  ]

  // Clear existing processes
  await prisma.homeProcess.deleteMany()

  // Create all processes
  for (const process of processes) {
    await prisma.homeProcess.create({
      data: process
    })
    console.log(`✅ Created process: ${process.title}`)
  }

  console.log('🎉 All home processes seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding processes:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 