/**
 * Fix settings_schema.json translation objects
 * Converts multilingual objects to English strings
 */

const fs = require('fs');

const schemaPath = 'config/settings_schema.json';
let schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));

// Helper to extract English value from translation object
function extractEnglish(value) {
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null && value.en) {
    return value.en;
  }
  if (typeof value === 'object' && value !== null) {
    // Try to find any language
    for (let lang of ['en', 'cs', 'da', 'de', 'es', 'fi', 'fr']) {
      if (value[lang]) return value[lang];
    }
    return JSON.stringify(value);
  }
  return String(value);
}

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

    // Check if this is a translation object
    if (
      key === 'name' ||
      key === 'content' ||
      key === 'label' ||
      key === 'info' ||
      key === 'unit' ||
      key === 'placeholder'
    ) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Check if it looks like a translation object (has language codes)
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

console.log('Fixing settings_schema.json translations...\n');
const fixed = fixTranslations(schema);

// Write back
fs.writeFileSync(schemaPath, JSON.stringify(fixed, null, 2));
console.log('✓ Fixed settings_schema.json');
console.log('  - Converted all translation objects to English strings');
