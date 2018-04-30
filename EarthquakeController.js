const EARTHQUAKEPATH = 'http://ftpcontent.worldnow.com/kwtv/custom/earthquake/'

/* example filename eq_180413212926_180413212949.json */
var earthquakeHistoryEl ;

function get(filename,callback){
  var contents =  localStorage.getItem(filename)
  if(contents)
    callback(JSON.parse(contents))
  else
    fetch(filename,callback)

}

function fetch(filename,callback){

  function EarthquakeHistory(data){
    /*this is a shitty name, but that is what is being forced by the .jsonp structure on the ftpcontent server blah
    THIS THE JSNOP CALLBACK */
    cannonicalize(data)
    normalize(data)
    localStorage.setItem(this.filename, JSON.stringify(data))
    var earthquakeHistoryEl = null;
    /* 'this' is the callback function from outside the controller */
    this.callback(data)
  }

  if(typeof window === 'object'){ //jsonp call
    window.EarthquakeHistory = EarthquakeHistory.bind({callback: callback, filename: filename})
    earthquakeHistoryEl = document.createElement('script');
    earthquakeHistoryEl.setAttribute('src', EARTHQUAKEPATH + filename);
    document.body.appendChild(earthquakeHistoryEl);
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

if(typeof window === 'object')
  window.EarthquakeController = {get,fetch}
export default {get}
