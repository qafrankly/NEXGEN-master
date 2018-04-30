const SEISMOGRAPHFEED = 'http://ftpcontent.worldnow.com/kwtv/custom/earthquake/data.json'
const CACHEDURATION = 5*60*1000; //5 minutes

var seismoScriptEl;

function fetch(callback){
  function EarthquakeData(data){
    /*this is a shitty name, but that is what is being forced by the .jsonp structure on the ftpcontent server blah
    THIS THE JSNOP CALLBACK */
    cannonicalize(data)
    normalize(data)
    localStorage.setItem('seismographData', JSON.stringify(data))
    localStorage.setItem('seismographDataTimestamp', Date.now())
    var seismoScriptEl = null;
    /* 'this' is the callback function from outside the controller */
    this(data)
  }

  if(typeof window === 'object'){ //jsonp call
    window.EarthquakeData = EarthquakeData.bind(callback)
    seismoScriptEl = document.createElement('script');
    seismoScriptEl.setAttribute('src', SEISMOGRAPHFEED);
    document.body.appendChild(seismoScriptEl);
  }
}


function cannonicalize(data){
  data.Samples = data.Samples.map(function(s,i,a){
    return {time: null, value: s}
  })
  data.Samples[0].time = data.Start
  data.Samples[data.Samples.length - 1].time = data.End
}

function normalize(data){
  var max = 0
  var min = 0
  data.Samples.map(function(s){
    max = s.value > max ? s.value : max
    min = s.value < min ? s.value : min
  })
  data.max = max
  data.min = min

}

function get(callback){
  try{
    if(localStorage.getItem('seismographData') && localStorage.getItem('seismographDataTimestamp'))
      if( Date.now() < parseInt(localStorage.getItem('seismographDataTimestamp'),10) + CACHEDURATION ){
        callback( JSON.parse(localStorage.getItem('seismographData')))
        return true;
      }
  } catch(e){
    console.error('something went wrong fetching seismograph data')
  }
    fetch(callback)
}

if(typeof window === 'object')
  window.SeismographController= {get,fetch}

export default {get,fetch}
