

function get(callback){
// Try HTML5 geolocation.
  if(typeof window !== 'object')
    return false
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log('geolocated to ', pos)
      var maxAge = 90 * 24 * 60 * 60
      document.cookie = `earthquakeMapLatitude=${pos.lat}; max-age=${maxAge};`;
      document.cookie = `earthquakeMapLongitude=${pos.lng}; max-age=${maxAge};`;
      callback(pos)
      return true
    }, function() {
      handleLocationError(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false);
  }
}

function handleLocationError(browserHasGeolocation) {
 callback(false)
 var message = browserHasGeolocation ? 'Your Browser Has GeoLocation ' : "Your Browser Doesn't Have GeoLocation "
 console.error(message)
}

if(typeof window === 'object')
window.GeoLocationController= {get}

export default {get}
