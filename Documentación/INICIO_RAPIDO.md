# Inicio Rápido

## 1. Instalar dependencias

```bash
npm install
```

## 2. Generar claves (primera vez)

```bash
npm run generate-keys
```

## 3. Editar o crear políticas

Ubicación:

- `src/public/politicas/*.md`

## 4. Firmar y verificar

```bash
npm run sign-policy -- --file src/public/politicas/privacy_es_googleplay.md
npm run verify-policy -- --file src/public/politicas/privacy_es_googleplay.md
```

## 5. Probar localmente

```bash
cd src/public
python -m http.server 8000
```

Abrir `http://localhost:8000`.

## 6. Publicar cambios

```bash
git add .
git commit -m "Actualizar políticas de privacidad"
git push
```

## Notas operativas

- `policies.json` debe mantenerse actualizado con las políticas publicadas.
- Cada archivo `.md` debe tener su correspondiente `.md.sig.json`.
- El historial de firma queda registrado en `AUDIT.md`.
