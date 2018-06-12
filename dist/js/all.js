class DBHelper{static fetchRestaurants(e){fetch("http://localhost:1337/restaurants/").then(function(e){return e.json()}).then(function(t){e(null,t),console.log("Sucess:",t)})}static fetchRestaurantById(e,t){DBHelper.fetchRestaurants((n,a)=>{if(n)t(n,null);else{const n=a.find(t=>t.id==e);n?t(null,n):t("Restaurant does not exist",null)}})}static fetchRestaurantByCuisine(e,t){DBHelper.fetchRestaurants((n,a)=>{if(n)t(n,null);else{const n=a.filter(t=>t.cuisine_type==e);t(null,n)}})}static fetchRestaurantByNeighborhood(e,t){DBHelper.fetchRestaurants((n,a)=>{if(n)t(n,null);else{const n=a.filter(t=>t.neighborhood==e);t(null,n)}})}static fetchRestaurantByCuisineAndNeighborhood(e,t,n){DBHelper.fetchRestaurants((a,r)=>{if(a)n(a,null);else{let a=r;"all"!=e&&(a=a.filter(t=>t.cuisine_type==e)),"all"!=t&&(a=a.filter(e=>e.neighborhood==t)),n(null,a)}})}static fetchNeighborhoods(e){DBHelper.fetchRestaurants((t,n)=>{if(t)e(t,null);else{const t=n.map((e,t)=>n[t].neighborhood),a=t.filter((e,n)=>t.indexOf(e)==n);e(null,a)}})}static fetchCuisines(e){DBHelper.fetchRestaurants((t,n)=>{if(t)e(t,null);else{const t=n.map((e,t)=>n[t].cuisine_type),a=t.filter((e,n)=>t.indexOf(e)==n);e(null,a)}})}static urlForRestaurant(e){return`./restaurant.html?id=${e.id}`}static imageUrlForRestaurant(e){return`/img/${e.id}.jpg`}static mapMarkerForRestaurant(e,t){return new google.maps.Marker({position:e.latlng,title:e.name,url:DBHelper.urlForRestaurant(e),map:t,animation:google.maps.Animation.DROP})}}var indexedDB=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB||window.shimIndexedDB,open=indexedDB.open("test-db",1);let restaurants,neighborhoods,cuisines;open.onupgradeneeded=function(){open.result.createObjectStore("RestaurantStore",{keyPath:"id"})},open.onsuccess=function(){var e=open.result;fetch("http://localhost:1337/restaurants/").then(function(e){return e.json()}).then(function(t){var n=e.transaction("RestaurantStore","readwrite").objectStore("RestaurantStore");console.log(t);for(var a=0;a<t.length;a++)n.put(t[a]);return n.getAll()})};var markers=[];let restaurant;var map;document.addEventListener("DOMContentLoaded",e=>{fetchNeighborhoods(),fetchCuisines()}),fetchNeighborhoods=(()=>{DBHelper.fetchNeighborhoods((e,t)=>{e?console.error(e):(self.neighborhoods=t,fillNeighborhoodsHTML())})}),fillNeighborhoodsHTML=((e=self.neighborhoods)=>{const t=document.getElementById("neighborhoods-select");e.forEach(e=>{const n=document.createElement("option");n.innerHTML=e,n.value=e,t.append(n)})}),fetchCuisines=(()=>{DBHelper.fetchCuisines((e,t)=>{e?console.error(e):(self.cuisines=t,fillCuisinesHTML())})}),fillCuisinesHTML=((e=self.cuisines)=>{const t=document.getElementById("cuisines-select");e.forEach(e=>{const n=document.createElement("option");n.innerHTML=e,n.value=e,t.append(n)})}),window.initMap=(()=>{self.map=new google.maps.Map(document.getElementById("map"),{zoom:12,center:{lat:40.722216,lng:-73.987501},scrollwheel:!1}),updateRestaurants()}),updateRestaurants=(()=>{const e=document.getElementById("cuisines-select"),t=document.getElementById("neighborhoods-select"),n=e.selectedIndex,a=t.selectedIndex,r=e[n].value,s=t[a].value;DBHelper.fetchRestaurantByCuisineAndNeighborhood(r,s,(e,t)=>{e?console.error(e):(resetRestaurants(t),fillRestaurantsHTML())})}),resetRestaurants=(e=>{self.restaurants=[],document.getElementById("restaurants-list").innerHTML="",self.markers.forEach(e=>e.setMap(null)),self.markers=[],self.restaurants=e}),fillRestaurantsHTML=((e=self.restaurants)=>{const t=document.getElementById("restaurants-list");e.forEach(e=>{t.append(createRestaurantHTML(e))}),addMarkersToMap()}),createRestaurantHTML=(e=>{var t=["An Image of Mission Chinese Food Restaurant","An Image of Emily Restaurant","An Image of Kang Ho Dong Baekjeong Restaurant","An Image of Katz's Delicatessen Restaurant","An Image of Roberta's Pizza Restaurant","An Image of Hometown BBQ Restaurant","An Image of ImaSuperiority Burger Restaurant","An Image of The Dutch Restaurant","An Image of Mu Ramen Restaurant","An Image of Casa Enrique Restaurant"];const n=document.createElement("li"),a=document.createElement("picture"),r=document.createElement("source"),s=document.createElement("source"),o=document.createElement("img");o.id="restaurant-img",o.className="restaurant-img",r.media="(min-width:1024px)",s.media="(min-width:480px)";for(var l=1;l<=10;l++)e.id==l&&(o.src="images/"+l+"-500_small.jpg",r.srcset=DBHelper.imageUrlForRestaurant(e),s.srcset="images/"+l+"-1000_medium.jpg",o.alt=t[l-1]);n.append(a),a.append(r),a.append(s),a.append(o);const i=document.createElement("h2");i.innerHTML=e.name,n.append(i);const u=document.createElement("p");u.innerHTML=e.neighborhood,n.append(u);const c=document.createElement("p");c.innerHTML=e.address,n.append(c);const d=document.createElement("a");return d.innerHTML="View Details",d.href=DBHelper.urlForRestaurant(e),n.append(d),n}),addMarkersToMap=((e=self.restaurants)=>{e.forEach(e=>{const t=DBHelper.mapMarkerForRestaurant(e,self.map);google.maps.event.addListener(t,"click",()=>{window.location.href=t.url}),self.markers.push(t)})}),window.initMap=(()=>{fetchRestaurantFromURL((e,t)=>{e?console.error(e):(self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:t.latlng,scrollwheel:!1}),fillBreadcrumb(),DBHelper.mapMarkerForRestaurant(self.restaurant,self.map))})}),fetchRestaurantFromURL=(e=>{if(self.restaurant)return void e(null,self.restaurant);const t=getParameterByName("id");t?DBHelper.fetchRestaurantById(t,(t,n)=>{self.restaurant=n,n?(fillRestaurantHTML(),e(null,n)):console.error(t)}):(error="No restaurant id in URL",e(error,null))}),fillRestaurantHTML=((e=self.restaurant)=>{var t=["An Image of Mission Chinese Food Restaurant","An Image of Emily Restaurant","An Image of Kang Ho Dong Baekjeong Restaurant","An Image of Katz's Delicatessen Restaurant","An Image of Roberta's Pizza Restaurant","An Image of Hometown BBQ Restaurant","An Image of ImaSuperiority Burger Restaurant","An Image of The Dutch Restaurant","An Image of Mu Ramen Restaurant","An Image of Casa Enrique Restaurant"];document.getElementById("restaurant-name").innerHTML=e.name,document.getElementById("restaurant-address").innerHTML=e.address,document.getElementById("restaurant-cuisine").innerHTML=e.cuisine_type;const n=document.getElementsByTagName("picture"),a=document.createElement("img");a.id="restaurant-img",a.className="restaurant-img";const r=document.getElementsByTagName("source"),s=document.createElement("source");r[0].media="(min-width:1024px)",s.media="(min-width:480px)";for(var o=1;o<=10;o++)e.id==o&&(a.src="images/"+o+"-500_small.jpg",r[0].srcset=DBHelper.imageUrlForRestaurant(e),a.setAttribute("alt",t[o-1]),s.srcset="images/"+o+"-1000_medium.jpg");n[0].appendChild(s),n[0].appendChild(a),e.operating_hours&&fillRestaurantHoursHTML(),fillReviewsHTML()}),fillRestaurantHoursHTML=((e=self.restaurant.operating_hours)=>{const t=document.getElementById("restaurant-hours");for(let n in e){const a=document.createElement("tr");a.tabIndex=0;const r=document.createElement("td");r.innerHTML=n,a.appendChild(r);const s=document.createElement("td");s.innerHTML=e[n],a.appendChild(s),t.appendChild(a)}}),fillReviewsHTML=((e=self.restaurant.reviews)=>{const t=document.getElementById("reviews-container"),n=document.createElement("h2");if(n.innerHTML="Reviews",t.appendChild(n),!e){const e=document.createElement("p");return e.innerHTML="No reviews yet!",void t.appendChild(e)}const a=document.getElementById("reviews-list");e.forEach(e=>{a.appendChild(createReviewHTML(e))}),t.appendChild(a)}),createReviewHTML=(e=>{const t=document.createElement("li"),n=document.createElement("p");n.innerHTML=e.name,n.classList.add("comment-username"),t.appendChild(n);const a=document.createElement("div");a.innerHTML=e.date,a.classList.add("reviews-date"),n.appendChild(a);const r=document.createElement("p");r.innerHTML=`Rating: ${e.rating}`,5===e.rating?r.style.background="#269900":4===e.rating?r.style.background="#39e600":3===e.rating?r.style.background="#e67300":r.style.background="#e60000",r.style.width="70px",r.style.color="white",r.style.borderRadius="5px",r.style.marginLeft="10px",r.style.fontWeight="bold",t.appendChild(r);const s=document.createElement("p");return s.innerHTML=e.comments,t.appendChild(s),t}),fillBreadcrumb=((e=self.restaurant)=>{const t=document.getElementById("breadcrumb"),n=document.createElement("li");n.innerHTML=e.name,t.appendChild(n)}),getParameterByName=((e,t)=>{t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");const n=new RegExp(`[?&]${e}(=([^&#]*)|&|#|$)`).exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null});