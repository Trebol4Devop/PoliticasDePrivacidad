# Políticas de Privacidad Seguras

Repositorio para publicar políticas de privacidad en Markdown con firma digital RSA-SHA256.

## Objetivo

Mantener políticas públicas verificables, con integridad trazable y flujo operativo simple.

## Estructura actual

```text
.
├── keys/
│   ├── public-key.pem
│   └── private-key.pem
├── scripts/
│   ├── generate-keys.js
│   ├── sign-policy.js
│   ├── test-policy.js
│   └── verify-policy.js
├── src/
│   └── public/
│       ├── index.html
│       ├── policy.html
│       ├── policies.json
│       ├── css/
│       ├── js/
│       └── politicas/
│           ├── *.md
│           └── *.md.sig.json
├── AUDIT.md
├── netlify.toml
├── package.json
└── README.md
```

## Requisitos

- Node.js 18+
- npm
- Python 3 (solo para servidor local opcional)

## Comandos

```bash
npm run generate-keys
npm run sign-policy -- --file src/public/politicas/archivo.md
npm run verify-policy -- --file src/public/politicas/archivo.md
npm test
```

## Flujo recomendado

1. Editar política en `src/public/politicas/`.
2. Firmar el archivo con `npm run sign-policy`.
3. Verificar con `npm run verify-policy`.
4. Confirmar cambios y publicar.

## Ejecución local

```bash
cd src/public
python -m http.server 8000
```

Abrir `http://localhost:8000`.

## Seguridad

- No subir `keys/private-key.pem` al repositorio.
- Mantener `keys/public-key.pem` versionada para verificación.
- Firmar toda modificación de políticas antes de publicar.

## Despliegue

Netlify publica directamente desde `src/public`.

Detalle operativo: `Documentación/NETLIFY_DEPLOY.md`.
