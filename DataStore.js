const KOTVPROPS = {
  Header: require( './Header/relativeConfigKotv.json' ).defaultProps,
  Footer: require('./Footer/package.json').defaultProps,
  UControl : require('./UControl/package.json').defaultProps,
  WarnEspRadar: require('./WarnEspRadar/package.json').defaultProps,
  HomePageTakeover: require('./HomePageTakeover/package.json').defaultProps,
  WeatherTakeover: require('./WeatherTakeover/package.json').defaultProps,
  TopStories: require('./TopStories/package.json').defaultProps,
  WeatherPage: require('./WeatherPage/package.json').defaultProps,
  EarthquakeMap: require('./EarthquakeMap/package.json').defaultProps
}


const KWTVPROPS = {
  Header: require( './Header/package-kwtv.json' ).defaultProps,
  Footer: require('./Footer/package-kwtv.json').defaultProps,
  UControl : require('./UControl/package-kwtv.json').defaultProps,
  WarnEspRadar: require('./WarnEspRadar/package-kwtv.json').defaultProps,
  HomePageTakeover: require('./HomePageTakeover/package-kwtv.json').defaultProps,
  WeatherTakeover: require('./WeatherTakeover/package-kwtv.json').defaultProps,
  TopStories: require('./TopStories/package-kwtv.json').defaultProps,
  WeatherPage: require('./WeatherPage/package-kwtv.json').defaultProps,
  EarthquakeMap: require('./EarthquakeMap/package-kwtv.json').defaultProps
}


var affiliate = 'kotv'
var affiliateAlreadySet = false;
if(typeof window == 'object'){//this is how we initialize the client-side DataStore
  affiliate = window.affiliate === 'kwtv' ? 'kwtv' : 'kotv';
  var affiliateAlreadySet = true;
}

function getAffiliate(){
  return affiliate
}

function setAffiliate(a){
  if((a === 'kotv' || a==='kwtv') && !affiliateAlreadySet){
      affiliate = a
      affiliateAlreadySet = true;
      return true
  }
  return false
}

function defaultProps(moduleName){
  console.log('DataStore Serving ' + moduleName + ' as ' + affiliate)
  if(!moduleName)
    return {}

  var all = affiliate ==='kotv' ? KOTVPROPS : KWTVPROPS
  return all[moduleName]
}

function all(){
  return affiliate ==='kotv' ? KOTVPROPS : KWTVPROPS
}


if(typeof window == 'object')
  window.DataStore = {setAffiliate,defaultProps,all,getAffiliate}

export default {setAffiliate,defaultProps,getAffiliate,all}
