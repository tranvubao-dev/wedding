# Deploy wedding on GitHub Pages

1. Upload/commit these files to the `main` branch of `tranvubao-dev/wedding`, preserving `.github/workflows/deploy.yml`.
2. Repository **Settings > Pages > Build and deployment > Source > GitHub Actions**.
3. Keep **Custom domain: bidtech.id.vn**.
4. Open **Actions > Deploy Wedding Vite Site**, ensure success.
5. Test `https://bidtech.id.vn/`. When certificate is ready, enable **Enforce HTTPS**.

The root `index.html` intentionally references `/src/main.tsx` for Vite source builds. Do not publish that file directly. GitHub Actions publishes `dist/` instead.

`vite.config.ts` uses `base: './'` for assets on both `bidtech.id.vn` and `tranvubao-dev.github.io/wedding/`.

Do not commit `node_modules`, `dist`, `.env` or secrets.
