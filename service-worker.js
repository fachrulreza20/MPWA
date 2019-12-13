// Pada kode dibawah, kita membuat variabel konstanta CACHE_NAME berisi string yang nanti akan kita gunakan sebagai nama cache. Kita juga membuat variabel urlsToCache untuk memudahkan menulis daftar aset dan halaman mana saja yang akan disimpan ke dalam cache.

// Kemudian kita daftarkan event listener untuk event install yang akan dipanggil setelah proses registrasi service worker berhasil. Di dalamnya kita membuka cache dengan nama yang sudah kita tulis. Bila belum ada maka cache baru dengan nama tersebut akan dibuat. Setelah cache dibuka, kita langsung menyimpan aset ke dalam cache tersebut sejumlah daftar aset yang sudah kita buat pada variable urlsToCache menggunakan method cache.addAll().


const CACHE_NAME = "realm";
var urlsToCache = [
  "/",
  "/nav.html",
  "/index.html",
  "/pages/home.html",
  "/pages/ligainggris.html",
  "/pages/favteam.html",
  "/pages/ligajerman.html",
  "/pages/ligaspanyol.html",
  "/css/materialize.min.css",
  "/js/materialize.min.js",
  "/js/nav.js",
  "/js/db-controller.js",
  "/js/nav.js",
  "/js/idb.js",
  "/js/fetchapi.js",
  "/images/ronaldo.jpg",
  "/images/zidane.jpg",
  "/images/rmsquad.jpg",
  "/images/records.png",

];
 
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});














// Tambahkan kode berikut pada file service-worker.js agar halaman menggunakan aset yang sudah disimpan di cache:


self.addEventListener("fetch", function(event) {
   const base_url = "https://api.football-data.org/v2/";


    if (event.request.url.indexOf(base_url) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME).then(function(cache) {
                return fetch(event.request).then(function(response) {
                    cache.put(event.request.url, response.clone());
                    return response;
                })
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request, {'ignoreSearch': true}).then(function(response) {
                return response || fetch (event.request);
            })
        )
    }   

    // if (event.request.url.indexOf(base_url) > -1) {
    

    // }

    // else{

    // }


    // event.respondWith(
    //   caches
    //     .match(event.request, { cacheName: CACHE_NAME })
    //     .then(function(response) {
    //       if (response) {
    //         console.log("ServiceWorker: Gunakan aset dari cache: ", response.url);
    //         return response;
    //       }
   
    //       console.log(
    //         "ServiceWorker: Memuat aset dari server: ",
    //         event.request.url
    //       );
    //       return fetch(event.request);
    //     })
    // );
  });
  






  // kita harus membuat mekanisme penghapusan cache yang lama agar tidak membebani pengguna


  self.addEventListener("activate", function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName != CACHE_NAME) {
              console.log("ServiceWorker: cache " + cacheName + " dihapus");
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });