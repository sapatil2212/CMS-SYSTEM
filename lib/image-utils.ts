import { promises as fs } from 'fs'
import path from 'path'

export async function deleteImageFromPublic(imageUrl: string): Promise<void> {
  try {
    // Extract filename from URL
    const urlParts = imageUrl.split('/')
    const filename = urlParts[urlParts.length - 1]
    
    if (!filename) return

    // Check if it's a local upload (starts with /api/uploads/)
    if (imageUrl.startsWith('/api/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', 'uploads', filename)
      
      // Check if file exists before trying to delete
      try {
        await fs.access(filePath)
        await fs.unlink(filePath)
        console.log(`Deleted image: ${filename}`)
      } catch (error) {
        console.log(`Image not found or already deleted: ${filename}`)
      }
    }
  } catch (error) {
    console.error('Error deleting image:', error)
  }
}

export function isLocalImage(imageUrl: string): boolean {
  return imageUrl.startsWith('/api/uploads/')
}

export function getImageFilename(imageUrl: string): string | null {
  if (!isLocalImage(imageUrl)) return null
  
  const urlParts = imageUrl.split('/')
  return urlParts[urlParts.length - 1] || null
} 