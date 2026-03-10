/**
 * B2B Page Validation Tests
 * Checks for common issues in B2B page setup
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 B2B Page Validation Report\n');
console.log('=' .repeat(60) + '\n');

const issues = [];
const warnings = [];
const passes = [];

// Helper functions
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    return null;
  }
}

function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    passes.push(`✓ File exists: ${description}`);
    return true;
  } else {
    issues.push(`✗ Missing file: ${description}`);
    return false;
  }
}

function checkStringInFile(filePath, pattern, description) {
  const content = readFile(filePath);
  if (content && pattern.test(content)) {
    passes.push(`✓ ${description}`);
    return true;
  } else {
    warnings.push(`⚠ ${description} - NOT FOUND`);
    return false;
  }
}

// Test 1: Check all required files exist
console.log('TEST 1: Required Files\n');
checkFileExists(
  'sections/b2b-landing.liquid',
  'B2B Landing Section'
);
checkFileExists(
  'snippets/b2b-hero.liquid',
  'B2B Hero Snippet'
);
checkFileExists(
  'snippets/b2b-catalog.liquid',
  'B2B Catalog Snippet'
);
checkFileExists(
  'templates/page.b2b.liquid',
  'B2B Page Template'
);

console.log('\n');

// Test 2: Check template routing
console.log('TEST 2: Template Routing\n');
const templateContent = readFile('templates/page.b2b.liquid');
if (templateContent) {
  if (templateContent.includes("section 'b2b-landing'")) {
    passes.push(`✓ page.b2b.liquid correctly includes b2b-landing section`);
  } else {
    issues.push(`✗ page.b2b.liquid missing b2b-landing section render`);
  }
}

console.log('\n');

// Test 3: Check authentication logic
console.log('TEST 3: Authentication Logic\n');
checkStringInFile(
  'sections/b2b-landing.liquid',
  /{% if customer %}/,
  'Customer authentication check'
);

checkStringInFile(
  'sections/b2b-landing.liquid',
  /routes\.account_login_url/,
  'Login URL redirect configured'
);

console.log('\n');

// Test 4: Check B2B tag verification
console.log('TEST 4: B2B Tag Verification\n');
checkStringInFile(
  'sections/b2b-landing.liquid',
  /'wholesale'|'b2b'/,
  'Wholesale/B2B customer tag check'
);

console.log('\n');

// Test 5: Check collection reference
console.log('TEST 5: Collection Reference\n');
checkStringInFile(
  'snippets/b2b-catalog.liquid',
  /collections\['wholesale'\]/,
  'Wholesale collection reference'
);

checkStringInFile(
  'snippets/b2b-catalog.liquid',
  /b2b_collection\.products/,
  'Product enumeration from collection'
);

console.log('\n');

// Test 6: Check product display logic
console.log('TEST 6: Product Display Logic\n');
checkStringInFile(
  'snippets/b2b-catalog.liquid',
  /product\.selected_or_first_available_variant/,
  'Variant selection logic'
);

checkStringInFile(
  'snippets/b2b-catalog.liquid',
  /variant\.compare_at_price > variant\.price/,
  'Wholesale discount calculation'
);

checkStringInFile(
  'snippets/b2b-catalog.liquid',
  /product\.featured_image/,
  'Product image handling'
);

console.log('\n');

// Test 7: Check JavaScript functionality
console.log('TEST 7: JavaScript Functionality\n');
checkStringInFile(
  'snippets/b2b-catalog.liquid',
  /window\.adjQty.*function/,
  'Quantity adjustment function'
);

checkStringInFile(
  'snippets/b2b-catalog.liquid',
  /\/cart\/add\.js/,
  'Cart API add endpoint'
);

checkStringInFile(
  'snippets/b2b-catalog.liquid',
  /\/cart\/update\.js/,
  'Cart API update endpoint'
);

console.log('\n');

// Test 8: Check styling
console.log('TEST 8: Styling & Classes\n');
checkStringInFile(
  'snippets/b2b-catalog.liquid',
  /\.b2b-card/,
  'B2B card styles defined'
);

checkStringInFile(
  'snippets/b2b-hero.liquid',
  /\.b2b-hero/,
  'B2B hero styles defined'
);

checkStringInFile(
  'snippets/b2b-catalog.liquid',
  /\.b2b-bulk/,
  'B2B bulk order styles defined'
);

console.log('\n');

// Test 9: Check fallback messaging
console.log('TEST 9: User Messaging\n');
checkStringInFile(
  'sections/b2b-landing.liquid',
  /Application Pending/,
  'Pending approval message'
);

checkStringInFile(
  'snippets/b2b-catalog.liquid',
  /No products found/,
  'Empty catalog message'
);

console.log('\n');

// Test 10: Check form functionality
console.log('TEST 10: Form Functionality\n');
checkStringInFile(
  'snippets/b2b-catalog.liquid',
  /bulk-rows/,
  'Bulk order row management'
);

checkStringInFile(
  'snippets/b2b-catalog.liquid',
  /bulk-product-sel/,
  'Product selector in bulk form'
);

checkStringInFile(
  'snippets/b2b-catalog.liquid',
  /bulk-variant-sel|bulk-qty/,
  'Variant and quantity inputs in bulk form'
);

console.log('\n');

// Summary
console.log('=' .repeat(60));
console.log('\n📊 VALIDATION SUMMARY\n');
console.log(`✓ Passed: ${passes.length}`);
console.log(`⚠ Warnings: ${warnings.length}`);
console.log(`✗ Issues: ${issues.length}`);

if (passes.length > 0) {
  console.log('\n✓ PASSED CHECKS:');
  passes.forEach(p => console.log(`  ${p}`));
}

if (warnings.length > 0) {
  console.log('\n⚠ WARNINGS:');
  warnings.forEach(w => console.log(`  ${w}`));
}

if (issues.length > 0) {
  console.log('\n✗ ISSUES TO FIX:');
  issues.forEach(i => console.log(`  ${i}`));
  process.exit(1);
} else {
  console.log('\n✓ All checks passed!\n');
  process.exit(0);
}
