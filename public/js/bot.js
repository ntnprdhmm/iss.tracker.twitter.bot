const socket = io()
socket.on('data', data => updateISSPosition(data))

let marker,
    map,
    previousCountryCode,
    geocoder,
    lat,
    lng;


createTimeline();
initMap();

/**
 * Create twitter timeline, delete previous timeline
 */
function createTimeline(){
  let timeline = document.getElementById('timeline');
  while(timeline.firstChild){
    timeline.removeChild(timeline.firstChild);
  }
  twttr.widgets.createTimeline({
    sourceType: 'profile',
    screenName: 'UTT_ISS_BOT'},timeline,{
    tweetLimit: 6
    });
}

/**
 * Initialize map
 */
function initMap(){
  map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 3
  });
  previousCountryCode = null;
  geocoder = new google.maps.Geocoder;
}

/**
 * Make a request to get the last coordinates of the ISS
 */
function updateISSPosition(data) {
  console.log("update: ", data)
  // Update map
  moveToLocation(data.latitude, data.longitude);
  drawMarker(data.latitude, data.longitude);
  // Get name of the city of the current location
  // do nothing in the catch => it's simply because the location can't be found
  //getCountryCode()
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


/**
 * Make a request to get the country code of a city from his coordinates
 * Geocoding doc : https://developers.google.com/maps/documentation/javascript/geocoding?hl=FR
 * @param  {string} lat : the latitude
 * @param  {string} lng : the longitude
 */
function getCountryCode() {
  axios.get(`http://api.geonames.org/findNearbyPostalCodesJSON?lat=${parseFloat(lat)}&lng=${parseFloat(lng)}&username=iss_utt_bot`).then(geoname=>{
      if (geoname.data.postalCodes[0]) {
        const countryCode = geoname.data.postalCodes[0].countryCode;
        if (previousCountryCode != countryCode) {
          previousCountryCode = countryCode;
          getCountry(countryCode);
        }
      }
    }).catch(e => {
      console.log(e);
    });
}


/**
 * Make a request to get the language of a country from his country code
 * @param  {string} countryCode : Country code
 */
function getCountry(countryCode) {
    axios.get(`https://restcountries.eu/rest/v2/alpha/${countryCode.toLowerCase()}`).then(countries=>{
      translateMessage(countries.data.nativeName, countries.data.languages[0][Object.keys(countries.data.languages[0])[0]]);
    })
}

/**
 * Make a request to translate the default message into the country language
 * @param  {string} countryName  Name of country
 * @param  {string} languageCode Code of language
 */
function translateMessage(countryName, languageCode) {
    const message = `The ISS is located above the ${countryName} !`;
    axios.get(`http://www.transltr.org/api/translate?text=${message}&to=${languageCode}&from=en`).then(translator=>{
      sendTweet(translator.data.translationText);
    })
}

/**
 * Send a tweet to the twitter account
 * @param  {string} message The content of the message
 */
function sendTweet(message) {
    axios.post('/api/tweet',{status:message,lat:lat,lng:lng}).then(()=>{
      createTimeline()
    }).catch((d)=>{console.log(d)}) //Just Because
}
