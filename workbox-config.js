module.exports = {
  globDirectory: './',
  globPatterns: [
    '**/public/*.{md,js,json,png,Identifier,PNG,svg,ico,html,webmanifest,css}',
  ],
  globIgnores: ['**/public/bundle.js'],
  swDest: './public/service-worker.js',
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  maximumFileSizeToCacheInBytes: 2500000,
  navigateFallback: '/public/index.html',
};
