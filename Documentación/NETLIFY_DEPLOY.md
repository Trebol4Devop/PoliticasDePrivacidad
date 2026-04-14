# Despliegue en Netlify

## Configuración del sitio

En Netlify, usar:

- Branch: `main`
- Build command: (vacío)
- Publish directory: `src/public`

## Flujo de publicación

1. Actualizar política en `src/public/politicas/`.
2. Firmar archivo actualizado.
3. Verificar firma.
4. Confirmar cambios y hacer push.
5. Netlify despliega automáticamente desde `main`.

## Verificación previa recomendada

```bash
npm run sign-policy -- --file src/public/politicas/privacy_es_googleplay.md
npm run verify-policy -- --file src/public/politicas/privacy_es_googleplay.md
```

## Validaciones de seguridad

- `keys/private-key.pem` no debe publicarse.
- `keys/public-key.pem` debe permanecer disponible para validación.
- No desplegar cambios de políticas sin firma vigente.
