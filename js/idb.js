import idb from 'idb';

    // Start a new transaction
idb.open('keyval-store', 1, upgradeDB => {
  switch (upgradeDB.oldVersion) {
    case 0:
      upgradeDB.createObjectStore('keyval', {keyPath:'id'});
  }
}).then(db => {
        fetch("http://localhost:1337/restaurants/")
        .then(function(response){
         return response.json()
        })
        .then(function(jsonData){
          var tx = db.transaction("keyval", "readwrite");
          var store = tx.objectStore("keyval");
          console.log(jsonData);
          for(var i=0; i<jsonData.length; i++){
            store.put(jsonData[i]);
          }
            return tx.complete && return store.getAll();
        });
}).then(() => console.log("Done!"));