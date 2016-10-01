// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
// tobeadded is a list of user defined points that have not been named yet; once they are named we will slam into locations array of objects

  // 1 create variable that is our "MAP"(saved set of points) of which is an array of objects that we iterate through to place a marker at various locations.
var toBeAdded = []
var markers = [];

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 43.6561, lng: -79.3802},
    zoom: 15
  });

  $.ajax({
    url: '/api/markers',
    method: 'GET',
    dataType: 'json',
    // data: locations,
    success: function(res) {
      res["0"].markers.forEach(function (m) {
        markers.push(placeMarker(new google.maps.LatLng(m.latitude, m.longitude), map));
      });
      // initMap(res["0"].markers)
      pullMarkerInfo(res["0"].markers)
    }
  });

  map.addListener('dblclick', function(e) {
    // on double click call the placeMarkerAndPanTo function with e.latLng and map as arguments
    console.log(e.latLng)
    markers.push(placeMarker(e.latLng, map));
    clickLoc = {
      // clickLoc = location of click. here we take the lng and lat of the click and make it into an object
      latitude: e.latLng.lat(),
      longitude: e.latLng.lng()
    }
    // here we push that object into an array objects that have unaliased locations. The user then has to give it a name and once that happens we push that into our 'MAP' or Set of points
    toBeAdded.push(clickLoc)
    console.log(toBeAdded)

    // I think this is where the form creation function should be implemented
    createEntryField(toBeAdded.length, e.latLng.lat(), e.latLng.lng());
  });
  var infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  var input = document.getElementById('pac-input');
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);


  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var infowindow = new google.maps.InfoWindow();

  autocomplete.addListener('place_changed', function(e) {
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
    markers.push(placeMarker(place.geometry.location, map));

    var searchLoc = {
      latitude:  place.geometry.location.lat(),
      longitude: place.geometry.location.lng()
    }
    toBeAdded.push(searchLoc);
    console.log(toBeAdded)
    markers.forEach(function (m) {
      m.setVisible(true);
    });
  // iterate through our locations and plot them on the map

    // I think this is where the form creation function should be implemented
    createEntryField(toBeAdded.length, place.geometry.location.lat(), place.geometry.location.lng());
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
      radius: 2
    }, function(results, status) {
      console.log(results)
    })
  })

  return marker;
}

// 2 functions that add a card (markers) on the left
function pullMarkerInfo(markers) {
  $(".well").empty();

  $(".well").append( $(`<p>Markers</p>
    <table>
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Latitude</th>
        <th>Longitude</th>
      </tr>`) );

  markers.forEach((element) => {
    $(".well").append(createRow(element));
  });

  $(".well").append( $(`</table>`) );
}

function createRow(markerObject) {
  let $feed = $(`<tr>
      <td>${markerObject.name}</td>
      <td>${markerObject.description}</td>
      <td>${markerObject.latitude}</td>
      <td>${markerObject.longitude}</td>
    </tr>`);

  return $feed;
}

// a function that would add a card (text entry) on the left of the web page
function createEntryField(counter, latitude, longitude) {
  $(".left-container").append( $(`<form id="${counter}" data-latitude="${latitude}" data-longitude="${longitude}">
      <label>${counter} Title:</label>
      <textarea name="text"></textarea>
      <label>Description:</label>
      <textarea name="text"></textarea>
      <input type="submit" value="ADD">
    </form>`) );
}

// $(document).ready(loadTweets);

// ChIJpTvG15DL1IkRd8S0KlBVNTI
// ChIJpTvG15DL1IkRd8S0KlBVNTI
