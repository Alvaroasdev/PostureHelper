import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://example.com', // tu URL real o deja el ejemplo
  sitemap: true,
  base: '/', // ruta base, pon '/' si vas a subir en la raíz de Netlify
});
