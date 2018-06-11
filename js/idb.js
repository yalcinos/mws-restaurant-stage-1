var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

var open = indexedDB.open('test-db',1);

// Create the schema
open.onupgradeneeded = function() {
    var db = open.result;
    var store = db.createObjectStore("RestaurantStore", {keyPath:"id"});
};

open.onsuccess = function CreateDB() {
		var db = open.result;
      	 
    // Start a new transaction
      fetch("http://localhost:1337/restaurants/")
      .then(function(response){
         return response.json()
      })
      .then(function(jsonData){
      	 var tx = db.transaction("RestaurantStore", "readwrite");
   		 var store = tx.objectStore("RestaurantStore");
   		 console.log(jsonData);
      	for(var i=0; i<jsonData.length; i++){
      		store.put(jsonData[i]);
      	}
      	return store.getAll();
      });
}
 