#!/usr/bin/env node

/**
 * Script para verificar integridad de archivos firmados
 * Uso: npm run verify-policy -- --file src/public/politicas/privacidad.md
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const fileArg = args.find(arg => arg.startsWith('--file=') || args[args.indexOf(arg) - 1] === '--file');
const filePath = fileArg?.split('=')[1] || args[args.length - 1];

if (!filePath) {
  console.error('Error: Especifica el archivo a verificar');
  console.error('Uso: npm run verify-policy -- --file src/public/politicas/privacidad.md');
  process.exit(1);
}

const fullPath = path.resolve(filePath);
const signaturePath = fullPath + '.sig.json';

if (!fs.existsSync(fullPath)) {
  console.error(`Error: El archivo no existe: ${fullPath}`);
  process.exit(1);
}

if (!fs.existsSync(signaturePath)) {
  console.error(`Error: No se encontro la firma: ${signaturePath}`);
  process.exit(1);
}

// Verificar que existe la clave publica
const publicKeyPath = path.join(__dirname, '../keys/public-key.pem');
if (!fs.existsSync(publicKeyPath)) {
  console.error('Error: No se encontro la clave publica');
  process.exit(1);
}

try {
  console.log(`\nVerificando archivo: ${filePath}`);

  // Leer archivo y firma
  const content = fs.readFileSync(fullPath, 'utf8');
  const metadata = JSON.parse(fs.readFileSync(signaturePath, 'utf8'));
  const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

  // Verificar hash
  const currentHash = crypto.createHash('sha256').update(content).digest('hex');
  const hashValid = currentHash === metadata.hash;

  // Verificar firma
  const verifier = crypto.createVerify('sha256');
  verifier.update(content);
  const signatureValid = verifier.verify(publicKey, metadata.signature, 'hex');

  console.log('\nResultados de Verificacion:');
  console.log(`   Archivo: ${metadata.file}`);
  console.log(`   Timestamp: ${metadata.timestamp}`);
  console.log(`   Algoritmo: ${metadata.algorithm}`);

  console.log('\nValidaciones:');
  console.log(`   ${hashValid ? '+' : '-'} Hash SHA-256: ${hashValid ? 'VALIDO' : 'INVALIDO'}`);
  console.log(`   ${signatureValid ? '+' : '-'} Firma Digital: ${signatureValid ? 'VALIDA' : 'INVALIDA'}`);

  if (hashValid && signatureValid) {
    console.log('\n!Documento autentico e integro!');
    console.log('   El documento no ha sido alterado desde su firma.\n');
    process.exit(0);
  } else {
    console.log('\n!Advertencia! El documento puede haber sido alterado.\n');
    process.exit(1);
  }

} catch (error) {
  console.error('Error al verificar:', error.message);
  process.exit(1);
}
