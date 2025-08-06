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
    
    // More comprehensive patterns to fix broken imports
    const patterns = [
      // Pattern 1: import { something } from 'import { logger } from '@/lib/logger';
      {
        regex: /import\s+\{[^}]*\}\s+from\s+'import\s+\{\s*logger\s*\}\s+from\s+'@\/lib\/logger';/g,
        replacement: (match) => {
          const originalImport = match.replace(/import\s+\{\s*logger\s*\}\s+from\s+'@\/lib\/logger';/, '');
          return originalImport + "import { logger } from '@/lib/logger';";
        }
      },
      // Pattern 2: import { something } from 'something'; import { logger } from '@/lib/logger';
      {
        regex: /import\s+\{[^}]*\}\s+from\s+'([^']+)';\s*import\s+\{\s*logger\s*\}\s+from\s+'@\/lib\/logger';/g,
        replacement: (match, p1) => {
          const importMatch = match.match(/import\s+\{([^}]*)\}\s+from/);
          if (importMatch) {
            return `import { logger } from '@/lib/logger';\nimport { ${importMatch[1]} } from '${p1}';`;
          }
          return match;
        }
      },
      // Pattern 3: import something from 'something'; import { logger } from '@/lib/logger';
      {
        regex: /import\s+([^{][^;]*)\s+from\s+'([^']+)';\s*import\s+\{\s*logger\s*\}\s+from\s+'@\/lib\/logger';/g,
        replacement: (match, p1, p2) => {
          return `import { logger } from '@/lib/logger';\nimport ${p1} from '${p2}';`;
        }
      },
      // Pattern 4: import { something } from 'import { logger } from '@/lib/logger'; something'
      {
        regex: /import\s+\{[^}]*\}\s+from\s+'import\s+\{\s*logger\s*\}\s+from\s+'@\/lib\/logger';\s*([^']+)'/g,
        replacement: (match, p1) => {
          const importMatch = match.match(/import\s+\{([^}]*)\}\s+from/);
          if (importMatch) {
            return `import { logger } from '@/lib/logger';\nimport { ${importMatch[1]} } from '${p1}';`;
          }
          return match;
        }
      },
      // Pattern 5: import something from 'import { logger } from '@/lib/logger'; something'
      {
        regex: /import\s+([^{][^;]*)\s+from\s+'import\s+\{\s*logger\s*\}\s+from\s+'@\/lib\/logger';\s*([^']+)'/g,
        replacement: (match, p1, p2) => {
          return `import { logger } from '@/lib/logger';\nimport ${p1} from '${p2}';`;
        }
      },
      // Pattern 6: import { something } from 'import { logger } from '@/lib/logger'; something'
      {
        regex: /import\s+\{[^}]*\}\s+from\s+'import\s+\{\s*logger\s*\}\s+from\s+'@\/lib\/logger';\s*([^']+)'/g,
        replacement: (match, p1) => {
          const importMatch = match.match(/import\s+\{([^}]*)\}\s+from/);
          if (importMatch) {
            return `import { logger } from '@/lib/logger';\nimport { ${importMatch[1]} } from '${p1}';`;
          }
          return match;
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
  console.log('🔧 Fixing remaining broken import statements...');
  
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
        file.includes('fix-remaining-imports.js')) {
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
    console.log('\n🎉 Remaining broken import statements have been fixed!');
  } else {
    console.log('\n✨ No broken imports found!');
  }
}

if (require.main === module) {
  main();
}

module.exports = { findFiles, fixBrokenImports }; 