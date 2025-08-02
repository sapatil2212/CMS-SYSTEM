const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding footer data...')

  // Create default footer settings
  const footerSettings = await prisma.footerSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      logoUrl: '/logo/logo.png',
      logoAlt: 'Alkalyne Logo',
      description: 'Precision busbar plating solutions for power distribution, EVs, and industrial applications. Enhancing performance and durability through advanced metal finishing.',
      phoneNumber: '+91 93731 02887',
      email: 'asgoals0494@gmail.com',
      address: 'Industrial Area\nNashik, Maharashtra\n422101'
    }
  })

  // Create default social media links
  const socialMediaData = [
    {
      platform: 'facebook',
      url: 'https://facebook.com',
      icon: 'facebook',
      order: 1
    },
    {
      platform: 'twitter',
      url: 'https://twitter.com',
      icon: 'twitter',
      order: 2
    },
    {
      platform: 'instagram',
      url: 'https://instagram.com',
      icon: 'instagram',
      order: 3
    },
    {
      platform: 'linkedin',
      url: 'https://linkedin.com',
      icon: 'linkedin',
      order: 4
    }
  ]

  for (const social of socialMediaData) {
    await prisma.footerSocialMedia.create({
      data: social
    })
  }

  // Create default quick links
  const quickLinksData = [
    { name: 'Home', href: '/', order: 1 },
    { name: 'Services', href: '/services', order: 2 },
    { name: 'Industries', href: '/industries', order: 3 },
    { name: 'About Us', href: '/about', order: 4 },
    { name: 'Contact', href: '/contact', order: 5 },
    { name: 'Blog', href: '/blog', order: 6 }
  ]

  for (const link of quickLinksData) {
    await prisma.footerQuickLink.create({
      data: link
    })
  }

  // Create default services
  const servicesData = [
    { name: 'Silver Plating', order: 1 },
    { name: 'Electroless Nickel Plating', order: 2 },
    { name: 'Bright Tin Plating', order: 3 },
    { name: 'Copper Plating', order: 4 },
    { name: 'Quality Testing', order: 5 },
    { name: 'Custom Solutions', order: 6 }
  ]

  for (const service of servicesData) {
    await prisma.footerService.create({
      data: service
    })
  }

  console.log('Footer data seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 