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


//When user offline,get data from indexDB for offline usage.
if(window.navigator.onLine){
  console.log('online!');

}else{
  console.log('offline');
//Post data to page when user offline.
  dbPromised.then(db =>{
    var tx = db.transaction("reviews","readonly");
    var store = tx.objectStore("reviews");
    return store.getAll();
  
  }).then(data => {
    const reviewForRest = data.filter(res => parseInt(res.restaurant_id) == getParameterByName('id'));
    const ul = document.getElementById('reviews-list');
    console.log('indsad:' ,reviewForRest);
    reviewForRest.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  })});

 
}
/////////////////////////////////////////7


//////////////////////////////////////////

//Get idb for restaurant details of restaurant_info page
if(window.navigator.onLine){
  console.log('online!');

}else{
  console.log('offline');
  const dbPromisedRestaurantDetail = idb.open('restaurant-store', 1, upgradeDB => {
  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore('items', {keyPath:'id'});
  }
});
  dbPromisedRestaurantDetail.then(db =>{
    var tx = db.transaction("items","readonly");
    var store = tx.objectStore("items");
    return store.getAll();
  
  }).then(data => {
    const IndexedRestData = data.find(res => parseInt(res.id) == getParameterByName('id'));
    console.log('ABD:', IndexedRestData);
    fillRestaurantHTML(IndexedRestData);
    const opHours = IndexedRestData.name;
    console.log('XCVB:',opHours);
    //fillRestaurantHoursHTML(opHours);
  });
  
}

