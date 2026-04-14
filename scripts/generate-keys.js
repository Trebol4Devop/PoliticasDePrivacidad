#!/usr/bin/env node

/**
 * Script para generar par de claves RSA
 * Uso: npm run generate-keys
 * 
 * IMPORTANTE: 
 * - Guarda las claves en lugar seguro
 * - NUNCA subas la clave privada a Git
 * - La clave pública se puede compartir públicamente
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const keysDir = path.join(__dirname, '../keys');

// Crear directorio si no existe
if (!fs.existsSync(keysDir)) {
  fs.mkdirSync(keysDir, { recursive: true });
}

console.log('Generando par de claves RSA-4096...');

// Generar par de claves
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'pkcs1',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

const publicKeyPath = path.join(keysDir, 'public-key.pem');
const privateKeyPath = path.join(keysDir, 'private-key.pem');

// Guardar claves
fs.writeFileSync(publicKeyPath, publicKey);
fs.writeFileSync(privateKeyPath, privateKey, { mode: 0o600 }); // Permisos restringidos

console.log('Claves generadas correctamente');
console.log(`Clave publica: ${publicKeyPath}`);
console.log(`Clave privada: ${privateKeyPath}`);
console.log('\nSEGURIDAD:');
console.log('   - La clave privada debe estar protegida');
console.log('   - NUNCA la subas a Git o repositorios publicos');
console.log('   - Guardala en un lugar seguro');
console.log('   - Puedes compartir la clave publica publicamente para verificacion\n');

// Crear archivo de configuración de ejemplo
const configExample = {
  publicKeyFile: 'keys/public-key.pem',
  policiesFolder: 'src/politicas',
  signatureExtension: '.sig',
  hashAlgorithm: 'sha256'
};

const configPath = path.join(__dirname, '../config.example.json');
if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, JSON.stringify(configExample, null, 2));
  console.log(`Archivo de configuracion de ejemplo: ${configPath}`);
}
