#!/usr/bin/env node

/**
 * Script para firmar archivos de política
 * Uso: npm run sign-policy -- --file src/public/politicas/privacidad.md
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const fileArg = args.find(arg => arg.startsWith('--file=') || args[args.indexOf(arg) - 1] === '--file');
const filePath = fileArg?.split('=')[1] || args[args.length - 1];

if (!filePath) {
  console.error('Error: Especifica el archivo a firmar');
  console.error('Uso: npm run sign-policy -- --file src/public/politicas/privacidad.md');
  process.exit(1);
}

const fullPath = path.resolve(filePath);

if (!fs.existsSync(fullPath)) {
  console.error(`Error: El archivo no existe: ${fullPath}`);
  process.exit(1);
}

// Verificar que existe la clave privada
const privateKeyPath = path.join(__dirname, '../keys/private-key.pem');
if (!fs.existsSync(privateKeyPath)) {
  console.error('Error: No se encontro la clave privada');
  console.error('Ejecuta primero: npm run generate-keys');
  process.exit(1);
}

try {
  console.log(`\nFirmando archivo: ${filePath}`);

  // Leer archivo
  const content = fs.readFileSync(fullPath, 'utf8');

  // Leer clave privada
  const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

  // Crear firma
  const signer = crypto.createSign('sha256');
  signer.update(content);
  const signature = signer.sign(privateKey, 'hex');

  // Calcular hash
  const hash = crypto.createHash('sha256').update(content).digest('hex');

  // Crear metadatos
  const metadata = {
    file: path.basename(fullPath),
    timestamp: new Date().toISOString(),
    hash: hash,
    signature: signature,
    algorithm: 'RSA-SHA256'
  };

  // Guardar firma
  const signatureFile = fullPath + '.sig.json';
  fs.writeFileSync(signatureFile, JSON.stringify(metadata, null, 2));

  console.log('Archivo firmado correctamente');
  console.log(`Original: ${fullPath}`);
  console.log(`Firma: ${signatureFile}`);
  console.log(`Hash SHA-256: ${hash}`);
  console.log(`Timestamp: ${metadata.timestamp}\n`);

  // Crear entrada en audit log
  const auditPath = path.join(__dirname, '../AUDIT.md');
  let auditContent = '';
  if (fs.existsSync(auditPath)) {
    auditContent = fs.readFileSync(auditPath, 'utf8');
  } else {
    auditContent = '# Registro de Auditoria\n\n';
  }

  const auditEntry = `## ${metadata.timestamp}
- **Archivo**: ${path.basename(fullPath)}
- **Hash**: \`${hash}\`
- **Accion**: Documento firmado
- **Algoritmo**: RSA-SHA256

`;

  fs.writeFileSync(auditPath, auditEntry + auditContent);
  console.log('Entrada de auditoria registrada\n');

} catch (error) {
  console.error('Error al firmar:', error.message);
  process.exit(1);
}
