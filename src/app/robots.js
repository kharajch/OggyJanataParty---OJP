export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/private/'],
      },
    ],
    sitemap: 'https://oggy-janata-party.vercel.app/sitemap.xml',
  };
}
