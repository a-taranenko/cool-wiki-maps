// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
// tobeadded is a list of user defined points that have not been named yet; once they are named we will slam into locations array of objects
var toBeAdded = []
var locations = [
  // 1 create variable that is our "MAP" of which is an array of objects that we iterate through to place a marker at various locations.
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
    placeMarker(e.latLng, map);
    clickLoc = {
      // clickLoc = location of click. here we take the lng and lat of the click and make it into an object
      latitude: e.latLng.lat(),
      longitude: e.latLng.lng()
    }
    console.log(clickLoc)
    // here we push that object into an array objects that have unaliased locations. The user then has to give it a name and once that happens we push that into our 'MAP' or Set of points
    toBeAdded.push(clickLoc)
    console.log(toBeAdded)
  });
  var infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  var locMarker, i;
  // iterate through our locations and plot them on the map
  for (i = 0; i < locations.length; i++) {
    locMarker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i].latitude, locations[i].longitude),
      map: map
    });
    google.maps.event.addListener(locMarker, 'click', function() {
      infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
        'Place ID: ' + place.place_id + '<br>' +
        place.formatted_address + '</div>');
      infowindow.open(map, this);
    });
  };
}
function placeMarker(latLng, map) {
  // this function sets a new marker location
  var marker = new google.maps.Marker({
    position: latLng,
    map: map
  });
}
