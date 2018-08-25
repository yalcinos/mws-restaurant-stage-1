import idb from 'idb';


  const dbPromised = idb.open('review-store', 1, upgradeDB => {
  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore('reviews', {keyPath:'id'});
  }
});
  dbPromised.then(db => {
        fetch("http://localhost:1337/reviews/")
        .then(function(response){
         return response.json()
        })
        .then(function(jsonData){
          var tx = db.transaction("reviews", "readwrite");
          var store = tx.objectStore("reviews");
          console.log(jsonData);
          for(var i=0; i<jsonData.length; i++){
            store.put(jsonData[i]);
          }
            return tx.complete && store.getAll();
        });
}).then(result => {console.log("Done!")});

//Get Data from indexDB
  dbPromised.then(db => {return db.transaction("reviews")
                        .objectStore("reviews").get(1);
                      }).then(obj => console.log(obj.name,obj.is_favorite,obj.neighborhood));
  //boyle yapılacak
  //then(obj => console.log(fillRestaurantsHTML(obj)));

//Post data to page when user offline.
  dbPromised.then(db =>{
    var tx = db.transaction("reviews","readonly");
    var store = tx.objectStore("reviews");
    return store.getAll();
  
  }).then(data => {const ul = document.getElementById('reviews-list');
  data.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  })});