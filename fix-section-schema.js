/**
 * Fix custom-content.liquid section schema translations
 */

const fs = require('fs');

const filePath = 'sections/custom-content.liquid';
let content = fs.readFileSync(filePath, 'utf-8');

// Helper to extract English value from translation object
function extractEnglish(value) {
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null && value.en) {
    return value.en;
  }
  if (typeof value === 'object' && value !== null) {
    for (let lang of ['en', 'cs', 'da', 'de', 'es', 'fi', 'fr']) {
      if (value[lang]) return value[lang];
    }
    return JSON.stringify(value);
  }
  return String(value);
}

// Extract schema part
const schemaStart = content.indexOf('{% schema %}');
const schemaEnd = content.indexOf('{% endschema %}');

if (schemaStart === -1 || schemaEnd === -1) {
  console.log('Schema not found');
  process.exit(1);
}

const schemaPart = content.substring(schemaStart + 12, schemaEnd).trim();
let schema = JSON.parse(schemaPart);

// Recursively fix all translation objects
function fixTranslations(obj) {
  if (Array.isArray(obj)) {
    return obj.map(fixTranslations);
  }
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const result = {};
  for (let key of Object.keys(obj)) {
    let value = obj[key];

    if (
      key === 'name' ||
      key === 'content' ||
      key === 'label' ||
      key === 'info' ||
      key === 'unit' ||
      key === 'placeholder' ||
      key === 'default'
    ) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const keys = Object.keys(value);
        if (keys.some(k => ['cs', 'da', 'de', 'en', 'es', 'fi', 'fr', 'it', 'ja', 'ko', 'nb', 'nl', 'pl', 'pt-BR', 'pt-PT', 'sv', 'th', 'tr', 'vi', 'zh-CN', 'zh-TW'].includes(k))) {
          result[key] = extractEnglish(value);
        } else {
          result[key] = fixTranslations(value);
        }
      } else if (Array.isArray(value)) {
        result[key] = fixTranslations(value);
      } else {
        result[key] = value;
      }
    } else {
      result[key] = fixTranslations(value);
    }
  }
  return result;
}

console.log('Fixing custom-content.liquid schema...\n');
const fixed = fixTranslations(schema);

const newSchema = JSON.stringify(fixed, null, 2);
const newContent = content.substring(0, schemaStart + 12) + '\n' + newSchema + '\n' + content.substring(schemaEnd);

fs.writeFileSync(filePath, newContent);
console.log('✓ Fixed custom-content.liquid schema');
console.log('  - Converted all translation objects to English strings');
