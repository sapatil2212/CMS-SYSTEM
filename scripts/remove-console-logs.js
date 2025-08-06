const fs = require('fs');
const path = require('path');

// Function to recursively find all TypeScript/JavaScript files
function findFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      results = results.concat(findFiles(filePath, extensions));
    } else if (extensions.some(ext => file.endsWith(ext))) {
      results.push(filePath);
    }
  });
  
  return results;
}

// Function to replace console logs with logger
function replaceConsoleLogs(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Check if file already imports logger
    const hasLoggerImport = content.includes("import { logger }") || content.includes("from '@/lib/logger'");
    
    // Replace console.log, console.warn, console.info, console.debug
    const consolePatterns = [
      { pattern: /console\.log\(/g, replacement: 'logger.log(' },
      { pattern: /console\.warn\(/g, replacement: 'logger.warn(' },
      { pattern: /console\.info\(/g, replacement: 'logger.info(' },
      { pattern: /console\.debug\(/g, replacement: 'logger.debug(' },
      { pattern: /console\.error\(/g, replacement: 'logger.error(' }
    ];
    
    consolePatterns.forEach(({ pattern, replacement }) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
      }
    });
    
    // Add logger import if needed and file was modified
    if (modified && !hasLoggerImport) {
      // Find the last import statement
      const importMatch = content.match(/(import.*?from.*?['"];?\n?)/g);
      
      if (importMatch) {
        const lastImport = importMatch[importMatch.length - 1];
        const loggerImport = "import { logger } from '@/lib/logger';\n";
        
        // Insert logger import after the last import
        content = content.replace(lastImport, lastImport + loggerImport);
      } else {
        // If no imports found, add at the beginning (after 'use client' if present)
        if (content.startsWith("'use client'")) {
          content = content.replace("'use client'", "'use client'\n\nimport { logger } from '@/lib/logger';");
        } else {
          content = "import { logger } from '@/lib/logger';\n\n" + content;
        }
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
function main() {
  console.log('🔍 Searching for files with console logs...');
  
  const rootDir = path.join(__dirname, '..');
  const files = findFiles(rootDir);
  
  console.log(`📁 Found ${files.length} TypeScript/JavaScript files`);
  
  let updatedCount = 0;
  let skippedCount = 0;
  
  files.forEach(file => {
    // Skip certain directories and files
    const relativePath = path.relative(rootDir, file);
    if (relativePath.includes('node_modules') || 
        relativePath.includes('.next') || 
        relativePath.includes('scripts') ||
        relativePath.includes('prisma/seed') ||
        file.includes('remove-console-logs.js')) {
      skippedCount++;
      return;
    }
    
    const updated = replaceConsoleLogs(file);
    if (updated) {
      updatedCount++;
    }
  });
  
  console.log('\n📊 Summary:');
  console.log(`✅ Updated: ${updatedCount} files`);
  console.log(`⏭️  Skipped: ${skippedCount} files`);
  console.log(`📁 Total processed: ${files.length} files`);
  
  if (updatedCount > 0) {
    console.log('\n🎉 Console logs have been replaced with logger utility!');
    console.log('💡 The logger will only output in development mode.');
  } else {
    console.log('\n✨ No console logs found to replace!');
  }
}

if (require.main === module) {
  main();
}

module.exports = { findFiles, replaceConsoleLogs }; 