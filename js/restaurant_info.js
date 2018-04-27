let restaurant;
var map;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
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
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;
<<<<<<< HEAD
  //const image = document.getElementById('restaurant-img');
  //image.className = 'restaurant-img'
  //image.src = DBHelper.imageUrlForRestaurant(restaurant);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

/**
* Create media queries for making responsive images for diffrent devices
*/
const picture=document.getElementsByTagName("picture");

//create img tag and add attributes for responsiveness
const img=document.createElement("img");
img.id='restaurant-img';
img.className='restaurant-img';

//Add source attr to picture tag
const source1=document.getElementsByTagName("source");
const source2=document.createElement("source");
 source1[0].media="(min-width:1024px)";
 source2.media="(min-width:480px)";
 for(var i=1; i<=10; i++){
  if(restaurant.id==i){
  img.src = "images/"+i+"-500_small.jpg";
  source1[0].srcset=DBHelper.imageUrlForRestaurant(restaurant);
  source2.srcset="images/"+i+"-1000_medium.jpg";
  }
 }
 picture[0].appendChild(source2);
 picture[0].appendChild(img);

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

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
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
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
/**
* Add scroll button for go back to default position.
*/
$(window).scroll(function() {
    if ($(this).scrollTop() >= 500) {        // If page is scrolled more than 50px
        $('#return-to-top').fadeIn(200);    // Fade in the arrow
    } else {
        $('#return-to-top').fadeOut(200);   // Else fade out the arrow
    }
});
$('#return-to-top').click(function() {      // When arrow is clicked
    $('body,html').animate({
        scrollTop : 0                       // Scroll to top of body
    }, 500);
});

/** This code is not work.I tried to write code which help to adjust height of the map when user scroll
 *   Probably I should have use "less" or "sass" for this code but now this is not our topic.
**/
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


