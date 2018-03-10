const socket = io()
socket.on('data', data => updateMap(data))

let marker = null
let map = null
let geocoder = null

createTimeline()
initMap()

/**
 * Create Twitter timeline
 */
function createTimeline(){
  let timeline = document.getElementById('timeline')
  while (timeline.firstChild) {
    timeline.removeChild(timeline.firstChild)
  }
  twttr.widgets.createTimeline(
    {
      sourceType: 'profile',
      screenName: 'ISS_bot_tracker'
    },
    timeline,
    {
      tweetLimit: 6
    }
  )
}

/**
 * Initialize map
 */
function initMap(){
  map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 3
  })
  geocoder = new google.maps.Geocoder
}

/**
 * Update the map with new ISS data
 */
function updateMap(data) {
  moveToLocation(data.latitude, data.longitude)
  drawMarker(data.latitude, data.longitude)
}

/**
 * Update map target
 * @param  {string} lat : the latitude
 * @param  {string} lng : the longitude
 */
function moveToLocation(lat, lng){
    const center = new google.maps.LatLng(lat, lng);
    map.panTo(center);
}

/**
 * Draw a new marker at the given coordinates
 * @param {string} lat : the latitude
 * @param {string} lng : the longitude
 */
function drawMarker(lat, lng) {
  const position = {lat: parseFloat(lat), lng: parseFloat(lng)};

  // replace the last marker icon by a simple point
  if(marker) {
    marker.setIcon({
      path: google.maps.SymbolPath.CIRCLE,
      scale: 2
    })
  }

  const markerIcon = new google.maps.MarkerImage(
    '/images/iss.png',
    new google.maps.Size(64, 64),
    new google.maps.Point(0, 0),
    new google.maps.Point(32, 32)
  );

  // create a new point with the last ISS coordinates
  marker = new google.maps.Marker({
    position,
    map,
    title: 'ISS !',
    icon: markerIcon
  })
}
