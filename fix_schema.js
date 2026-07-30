const fs = require('fs');
const schemaPath = 'D:/final alaa seg/ME-project final/prisma/schema.prisma';

let content = fs.readFileSync(schemaPath, 'utf-8');

// Replace CRLF with LF for matching
const normalized = content.replace(/\r\n/g, '\n');

const oldBlock = `datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}`;

const newBlock = `datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
  schemas   = ["public", "auth"]
}`;

if (normalized.includes('schemas')) {
  console.log('schemas already present');
} else if (normalized.includes(oldBlock)) {
  const result = normalized.replace(oldBlock, newBlock);
  // Write back with CRLF
  fs.writeFileSync(schemaPath, result.replace(/\n/g, '\r\n'), 'utf-8');
  console.log('✅ Added schemas = ["public", "auth"]');
} else {
  console.log('❌ Could not find datasource block');
}
