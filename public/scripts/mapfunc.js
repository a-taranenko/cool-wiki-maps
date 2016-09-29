// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
// tobeadded is a list of user defined points that have not been named yet; once they are named we will slam into locations array of objects
var toBeAdded = []
var locations = [
  // 1 create variable that is our "MAP"(saved set of points) of which is an array of objects that we iterate through to place a marker at various locations.
  {
    name: "lighthouse",
    latitude: 43.6452503,
    longitude: -79.3955961
  },
  // 2
  {
    name: "cityhall",
    latitude: 43.6533814,
    longitude: -79.3841523
  },
  // 3
  {
    name: "myHouse",
    latitude: 43.6491821,
    longitude: -79.5172994
  },
  // 4
  {
    name: "dickPlace",
    latitude: 53.9557409,
    longitude: -1.0759223
  }
];

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 43.6561, lng: -79.3802},
    zoom: 15
  });
  map.addListener('dblclick', function(e) {
    // on double click call the placeMarkerAndPanTo function with e.latLng and map as arguments
    console.log(e.latLng)
    placeMarker(e.latLng, map);
    clickLoc = {
      // clickLoc = location of click. here we take the lng and lat of the click and make it into an object
      latitude: e.latLng.lat(),
      longitude: e.latLng.lng()
    }
    // here we push that object into an array objects that have unaliased locations. The user then has to give it a name and once that happens we push that into our 'MAP' or Set of points
    toBeAdded.push(clickLoc)
  });

  var infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  var marker, i;
  var input = document.getElementById('pac-input');
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);


  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var infowindow = new google.maps.InfoWindow();
  for (i = 0; i < locations.length; i++) {
    placeMarker(new google.maps.LatLng(locations[i].latitude, locations[i].longitude), map)
    // marker = new google.maps.Marker({
    //   position: new google.maps.LatLng(locations[i].latitude, locations[i].longitude),
    //   map: map
    // });
  };

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
    placeMarker(place.geometry.location, map)
    marker.setVisible(true);
  // iterate through our locations and plot them on the map

  })
}
function placeMarker(latLng, map) {
  // this function sets a new marker location
  var marker = new google.maps.Marker({
    position: latLng,
    map: map
  });
  google.maps.event.addListener(marker, 'click', function() {
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
      location: latLng,
      radius: 20
    }, function(results, status) {
      console.log(results)
    })
  })
}


// ChIJpTvG15DL1IkRd8S0KlBVNTI
// ChIJpTvG15DL1IkRd8S0KlBVNTI
