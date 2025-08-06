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

// Function to fix broken import statements
function fixBrokenImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix patterns where import statements got merged incorrectly
    const patterns = [
      // Pattern 1: import { logger } from '@/lib/logger';
import {  something  } from '{
        regex: /import\s+\{[^}]*\}\s+from\s+';import\s+\{\s*logger\s*\}\s+from\s+'@\/lib\/logger';/g,
        replacement: (match) => {
          // Extract the original import
          const originalImport = match.replace(/import\s+\{\s*logger\s*\}\s+from\s+'@\/lib\/logger';/, '');
          return originalImport + "import { logger } from '@/lib/logger';";
        }
      },
      // Pattern 2: import { logger } from '@/lib/logger';
import {  something  } from 'something';
      {
        regex: /import\s+\{[^}]*\}\s+from\s+'([^']+)';\s*import\s+\{\s*logger\s*\}\s+from\s+'@\/lib\/logger';/g,
        replacement: (match, p1) => {
          return `import { logger } from '@/lib/logger';\nimport { ${match.match(/\{([^}]*)\}/)[1]} } from '${p1}';`;
        }
      },
      // Pattern 3: import { logger } from '@/lib/logger';
import {  something  } from 'something';
      {
        regex: /import\s+([^{][^;]*)\s+from\s+'([^']+)';\s*import\s+\{\s*logger\s*\}\s+from\s+'@\/lib\/logger';/g,
        replacement: (match, p1, p2) => {
          return `import { logger } from '@/lib/logger';\nimport ${p1} from '${p2}';`;
        }
      }
    ];
    
    patterns.forEach(({ regex, replacement }) => {
      if (regex.test(content)) {
        content = content.replace(regex, replacement);
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
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
  console.log('🔧 Fixing broken import statements...');
  
  const rootDir = path.join(__dirname, '..');
  const files = findFiles(rootDir);
  
  console.log(`📁 Found ${files.length} TypeScript/JavaScript files`);
  
  let fixedCount = 0;
  let skippedCount = 0;
  
  files.forEach(file => {
    // Skip certain directories and files
    const relativePath = path.relative(rootDir, file);
    if (relativePath.includes('node_modules') || 
        relativePath.includes('.next') || 
        file.includes('fix-broken-imports.js')) {
      skippedCount++;
      return;
    }
    
    const fixed = fixBrokenImports(file);
    if (fixed) {
      fixedCount++;
    }
  });
  
  console.log('\n📊 Summary:');
  console.log(`✅ Fixed: ${fixedCount} files`);
  console.log(`⏭️  Skipped: ${skippedCount} files`);
  console.log(`📁 Total processed: ${files.length} files`);
  
  if (fixedCount > 0) {
    console.log('\n🎉 Broken import statements have been fixed!');
  } else {
    console.log('\n✨ No broken imports found!');
  }
}

if (require.main === module) {
  main();
}

module.exports = { findFiles, fixBrokenImports }; 