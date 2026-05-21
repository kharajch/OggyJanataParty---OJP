export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/private/'],
      },
    ],
    sitemap: [
      'https://oggyjanataparty.vercel.app/sitemap.xml',
      'https://oggyjanataparty.vercel.app/sitemap.txt',
    ],
  };
}
