const swCacheName = 'static-restaurant-01';

// list of assets to cache on install
// cache each restaurant detail page as well
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(swCacheName)
      .then(cache => {
        return cache.addAll([
          '/index.html',
          '/css/styles.css',
          '/js/dbhelper.js',
          '/js/register_sw.js',
          '/js/main.js',
          '/js/restaurant_info.js',
          // '/data/restaurants.json',
          '/restaurant.html?id=1',
          '/restaurant.html?id=2',
          '/restaurant.html?id=3',
          '/restaurant.html?id=4',
          '/restaurant.html?id=5',
          '/restaurant.html?id=6',
          '/restaurant.html?id=7',
          '/restaurant.html?id=8',
          '/restaurant.html?id=9',
          '/restaurant.html?id=10',
          '/img/fixed/offline_img1.png'
        ]).catch(error => {
          console.log('Caches open failed: ' + error);
        });
      })
  );
});