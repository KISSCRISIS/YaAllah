const fs = require('fs');
const schemaPath = 'D:/final alaa seg/ME-project final/prisma/schema.prisma';
let c = fs.readFileSync(schemaPath, 'utf-8').replace(/\r\n/g, '\n');
c = c.replace(
  'generator client {\n  provider = "prisma-client-js"\n}',
  'generator client {\n  provider = "prisma-client-js"\n  previewFeatures = ["multiSchema"]\n}'
);
fs.writeFileSync(schemaPath, c.replace(/\n/g, '\r\n'), 'utf-8');
console.log('✅ Added multiSchema preview feature');
