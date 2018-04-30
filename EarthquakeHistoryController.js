const EARTHQUAKEHISTORYFEED = 'http://ftpcontent.worldnow.com/kwtv/custom/earthquake/earthquakehistory.json'
/* This feed only produces the start time and file name of the record */

const CACHEDURATION = 60*60*1000; //1 hour

var earthquakeHistoryManifestEl;

function fetch(callback){
  function EarthquakeManifest(data){
    /*this is a shitty name, but that is what is being forced by the .jsonp structure on the ftpcontent server blah
    THIS THE JSNOP CALLBACK */

    localStorage.setItem('earthquakeHistoryData', JSON.stringify(data))
    localStorage.setItem('earthquakeHistoryDataTimestamp', Date.now())
    var earthquakeHistoryManifestEl = null;
    /* 'this' is the callback function from outside the controller */
    this(data)
  }

  if(typeof window === 'object'){ //jsonp call
    window.EarthquakeManifest = EarthquakeManifest.bind(callback)
    earthquakeHistoryManifestEl = document.createElement('script');
    earthquakeHistoryManifestEl.setAttribute('src', EARTHQUAKEHISTORYFEED);
    document.body.appendChild(earthquakeHistoryManifestEl);
  }
}


function get(callback){
  try{
    if(localStorage.getItem('earthquakeHistoryData') && localStorage.getItem('earthquakeHistoryDataTimestamp'))
      if( Date.now() < parseInt(localStorage.getItem('earthquakeHistoryDataTimestamp'),10) + CACHEDURATION ){
        callback( JSON.parse(localStorage.getItem('earthquakeHistoryData')))
        return true;
      }
  } catch(e){
    console.error('something went wrong fetching seismograph data')
  }
    fetch(callback)
}

if(typeof window === 'object')
  window.EarthquakeHistoryController= {get,fetch}

export default {get}
