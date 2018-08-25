let restaurant;
let review;
var newMap;

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {  
  initMap();
});

/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {      
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        scrollWheelZoom: false
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1IjoieWFsY2lub3MiLCJhIjoiY2ppYzJ2Nms0MDM0MTN3cGliaGhycnlmayJ9.VnwaAAVaCBS2TOyJ3M_6BQ',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'    
      }).addTo(newMap);
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
  fetchReviewsFromURL((error,review) =>{
    if(error){console.error(error);
    }else
    console.log(review.name);
  })
}  
/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      console.log('bbbb:', restaurant);
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

fetchReviewsFromURL = (callback) => {
  if (self.review) { // restaurant already fetched!
    callback(null, self.review);
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
      DBHelper.fetchReviewsByRestaurantId(id,(error,review) =>{
        self.review = review;
        if(!review){
          console.error(error);
          return;
        }else
        fillReviewsHTML();
        callback(null,review);
      });
  }
}
/**
 * Create restaurant HTML  add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  var altArray=["An Image of Mission Chinese Food Restaurant","An Image of Emily Restaurant",
  "An Image of Kang Ho Dong Baekjeong Restaurant","An Image of Katz's Delicatessen Restaurant",
  "An Image of Roberta's Pizza Restaurant","An Image of Hometown BBQ Restaurant",
  "An Image of ImaSuperiority Burger Restaurant","An Image of The Dutch Restaurant","An Image of Mu Ramen Restaurant",
  "An Image of Casa Enrique Restaurant"];

  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;
  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;
  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

/**
* Create media queries for making responsive images for diffrent devices
*/
const picture=document.getElementsByTagName("picture");

//create img tag and add attributes for responsiveness
const img=document.createElement("img");
img.id='restaurant-img';
img.className='restaurant-imgs';

//Add source attr to picture tag and make responsive images
const source1=document.getElementsByTagName("source");
const source2=document.createElement("source");
 source1[0].media="(min-width:1024px)";
 source2.media="(min-width:480px)";
 for(var i=1; i<=10; i++){
  if(restaurant.id==i){
  img.src = "images/"+i+"-500_small.jpg";
  source1[0].srcset=DBHelper.imageUrlForRestaurant(restaurant);
  //source1[0].setAttribute('alt',altArray[i-1]);
  //source2.setAttribute('alt',altArray[i-1]);
  img.setAttribute('alt',altArray[i-1]);
  source2.srcset="images/"+i+"-1000_medium.jpg";
  }
 }

 picture[0].appendChild(source2);
 picture[0].appendChild(img);

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');
    row.tabIndex=0;

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
   
  }
  
}

/**
 * Create all reviews HTML and add them to the webpage.
 */

 //BUARADAN DEVAM- sıkıntı review değişkenine self.restaurant.review dediğimde veri gitmiyor ?
fillReviewsHTML = (reviews = self.review) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  const reviewButton = document.createElement('button');
  const modal = document.getElementById('myModal');
  const span = document.getElementsByClassName("close")[0];
  const restidInput = document.getElementById('resid');
  //
  console.log("bayrak:" , reviews);
  // When the user clicks the button, open the modal 
reviewButton.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
  restidInput.value = self.review.id;
  reviewButton.id = 'reviews-button';
  reviewButton.innerHTML = 'Add Review';
  title.innerHTML = 'Reviews';
  container.appendChild(title);
  container.appendChild(reviewButton);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  console.log(typeof reviews);
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  //ul.appendChild(createReviewHTML(reviews));
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  name.classList.add("comment-username");
  li.appendChild(name);

  const date = document.createElement('div');
  date.innerHTML = review.date;
  date.classList.add("reviews-date");
  name.appendChild(date);

/**
*Add color style for rating score
*/
  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  if(review.rating===5){
    rating.style.background="#269900";
  }
  else if(review.rating===4){
    rating.style.background="#39e600";
  }
  else if(review.rating===3){
  rating.style.background="#e67300";
  }
  else
    rating.style.background="#e60000";
  rating.style.width="70px";
  rating.style.color="white";
  rating.style.borderRadius="5px";
  rating.style.marginLeft="10px";
  rating.style.fontWeight="bold";
  
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}
const rewButton = document.getElementById("submitReview");
 rewButton.addEventListener("click",function(){
    event.preventDefault();
      DBHelper.PostReviewData();
       
    })

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


/** This code is not work.I tried to write code which help to adjust height of the map when user scroll
 *   Probably I should have use "less" or "sass" for this code but now this is not our topic.

setInterval(function(){
  var scrollPosition=document.documentElement;
  var scrollT=scrollPosition.scrollTop
  //this 65 is footer height because 
  if(scrollT=(scrollT-65)){
  $('#map-container').css("height","78%");
  }else{
  $('#map-container').css("height","90%");
  }
},100)
*/


