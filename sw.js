/**
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
**/
var staticCacheName='restaurant-v1';
self.addEventListener('install',function(event){
	var urlsToCache=[
		'/',
		'js/dbhelper.js',
		'js/main.js',
		'js/restaurant_info.js'
	];

	event.waitUntil(
			caches.open(staticCacheName).then(function(cache){
				return cache.addAll(urlsToCache);
			})
		)
});

self.addEventListener('active',function(event){
	event.waitUntil(
			//get all cache name that exist.
			caches.keys().then(function(cacheNames){
				return Promise.all(
						return cacheNames.filter(function(cacheName){
					return cacheName.startWith('restaurant-') &&
					cacheName != staticCacheName;
					}).map(function(cacheName){
					return cache.delete(cacheName);
				})
			);
				
		});
	);
});