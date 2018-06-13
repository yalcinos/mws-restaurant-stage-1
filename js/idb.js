import idb from 'idb';


  idb.open('restaurant-store', 1, upgradeDB => {
  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore('items', {keyPath:'id'});
  }
}).then(db => {
        fetch("http://localhost:1337/restaurants/")
        .then(function(response){
         return response.json()
        })
        .then(function(jsonData){
          var tx = db.transaction("items", "readwrite");
          var store = tx.objectStore("items");
          console.log(jsonData);
          for(var i=0; i<jsonData.length; i++){
            store.put(jsonData[i]);
          }
            return tx.complete && store.getAll();
        });
}).then(() => console.log("Done!"));

