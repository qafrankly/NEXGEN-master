import React, {Component} from 'react'
import GeoLocationController from '../GeoLocationController'
import Toggle from '../Toggle'
const GOOGLEMAPSSRC = 'https://maps.googleapis.com/maps/api/js?key='
const GOOGLEAPIKEY = 'AIzaSyBzDRqc875DrBU4D_t-1ikHo26hNZSoD3E';
const USGSKMLDATASOURCE = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=kml&minmagnitude=0&minlongitude=-103&maxlongitude=-94&maxlatitude=37&minlatitude=33&starttime='
const USGSGEOJSONDATASOURCE = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=2.5&minlongitude=-103&maxlongitude=-94&maxlatitude=37&minlatitude=33&starttime='

/* Documentation of query: https://earthquake.usgs.gov/fdsnws/event/1/ */

class EarthquakeMap extends Component {
  constructor(props) {
    super(props)
    this.map = false
    this.heatMap
    this.heatMapData
    this.googleScriptPromise
    this.USGSGeoJsonDataPromise
    this.USGSGeoJsonData
    this.circleFillColor = '#BE0000'
    this.circleFillOpacity = 0.4
    this.heatMapAlreadySet = false
    this.state = {
      earthquakes : [],
      center: { lat: 36.300332,lng:  -97.348378},
      showHeatMap: true,

      minimumMagnitude: 0,
      daysAgo: 60
    }


  }

  componentWillMount() {
    if (typeof window === 'object') {
      this.googleScriptPromise = new Promise(function(resolve, reject) {
        var googleMapsScript = document.createElement('script');
        googleMapsScript.setAttribute('src', GOOGLEMAPSSRC + GOOGLEAPIKEY + '&libraries=visualization');
        document.body.appendChild(googleMapsScript);
        googleMapsScript.onload = function() {
          resolve();
        };
        googleMapsScript.onerror = function() {
          reject();
        };
      })

      this.USGSGeoJsonDataPromise = this.Ajax(USGSGEOJSONDATASOURCE + this.getStartTime()).then((data) => {
        this.USGSGeoJsonData = JSON.parse(data)
        return this.USGSGeoJsonData
      })
    }

  }

  componentDidMount() {
    this.googleScriptPromise.then(this.initMap)
  }

  initMap = () => {
    this.map = new google.maps.Map(document.getElementsByClassName('map')[0], {
      center: this.state.center,
      zoom: 8
    });
    this.USGSGeoJsonDataPromise.then(this.buildEarthquakes)
    //code for KML layer from USGS
    // var ctaLayer = new google.maps.KmlLayer({
    //   url: USGSKMLDATASOURCE + this.getStartTime(),
    //   map: this.map,
    //   preserveViewport: true
    // });
  }

  buildHeatMap= () => {//ony from those shown
    if(this.heatMap){
      this.heatMap.setMap(null)
      delete this.heatMap
    }
    this.heatMap = new google.maps.visualization.HeatmapLayer({
      data: this.state.earthquakes.filter(function(e){return e.showMarker}),
      radius: 30,
      dissipating: true,

    });


    this.setState({showHeatMap: true})
  }

  centerMap = () =>{
    GeoLocationController.get((pos)=>{
      if(pos){
        this.map.setCenter(pos);
        this.map.setZoom(9)
      }

    })
  }

  buildEarthquakes = () =>{
    var features = this.USGSGeoJsonData.features
    this.setState({earthquakes: []})
    var earthquakes = features.map((f,i,a)=>{
      var earthquake = {
                          magnitude: f.properties.mag,
                          timeStamp: f.properties.time,
                          date: new Date(f.properties.time),
                          title: f.properties.title,
                          place: f.properties.place,
                          modifiedMercalliIntensity: f.properties.cdi,
                          showWindow: false,
                          showMarker: true,
                          felt: f.properties.felt,
                          location: new google.maps.LatLng(f.geometry.coordinates[1], f.geometry.coordinates[0]),
                          weight: Math.sqrt(Math.pow(10, f.properties.mag + 1))
                       }
      earthquake.position = {
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0]
      }

      earthquake.marker = new google.maps.Circle({

          strokeOpacity: 0,
          strokeWeight: 2,
          fillColor: this.circleFillColor,
          fillOpacity: this.circleFillOpacity,

          center: earthquake.location,
          radius: earthquake.weight
        });
      earthquake.infoWindow = new google.maps.InfoWindow({
         content: this.infoWindow(earthquake),
         position: earthquake.location
       })

       return earthquake
    })

    earthquakes.sort(function(a,b){
      return a.magnitude < b.magnitude ? -1 : 1
    })

    this.setState({earthquakes: earthquakes}, ()=>{
      this.state.earthquakes.map((e,i,a)=>{
        e.marker.addListener('click', ()=> {
           this.clickMarker(e,i)
         });
      })
      this.buildHeatMap()
    })
  }

  clickMarker= (e,i) => {

     //this.setState({center:{lat: e.marker.center.lat(), lng: e.marker.center.lng()}})
     var earthquakes = this.state.earthquakes.map(function(e1,i,a){
       e1.showWindow = false
       return e1
     })
     earthquakes[i].showWindow = true
     this.setState({earthquakes: earthquakes})
     this.map.setZoom(this.map.getZoom() > 10 ? this.map.getZoom() : 10);
     this.map.setCenter(e.location);
  }


  infoWindow(e){

    return `<div class='info-window'>
              <div>${e.place}</div>
              <div> Magnitude: ${e.magnitude}</div>
            </div>
            `
  }

  getStartTime = () => {
    var a = new Date,
      a = new Date(a.setDate(a.getDate() - this.state.daysAgo)),
      b = a.getFullYear(),
      d = a.getMonth() + 1,
      a = a.getDate();
    return b + "-" + (
      10 > d
      ? "0" + d
      : d) + "-" + (
      10 > a
      ? "0" + a
      : a)
  }

  Ajax(url) {
    return new Promise(function(resolve, reject) {
      let req = new XMLHttpRequest();
      req.open('GET', url);
      req.onload = function() {
        if (req.status === 200) {
          resolve(req.response);
        } else {
          reject(new Error(req.statusText));
        }
      };
      req.onerror = function() {
        reject(new Error('Network error'));
      };
      req.send();
    });
  }

  toggleHeatMap= (checked) =>{
    this.setState({showHeatMap: checked})
  }



  filterEarthquakes=()=>{
    this.setState({earthquakes: this.state.earthquakes.map((e)=>{
      var earthquake = e
      if(e.magnitude <= this.state.minimumMagnitude ){
        earthquake.showMarker = false
        return earthquake
      }

      if(e.timeStamp <= Date.now() - this.state.daysAgo*60*60*24*1000){
        earthquake.showMarker = false
        return earthquake
      }
      earthquake.showMarker = true
      earthquake.showWindow = false
      return earthquake
    })})
  }


  render() {
    if(this.map){

      this.state.earthquakes.map((e,i,a)=>{
        if(e.showWindow )
          e.infoWindow.open(this.map)
        else
          e.infoWindow.close(this.map)

        if(e.showMarker)
          e.marker.setMap(this.map)
        else
          e.marker.setMap(null)
      })
      if(this.heatMap){
        if(this.state.showHeatMap  )
          this.heatMap.setMap(this.map)
        else
            this.heatMap.setMap(null)

      }
    }

    return (
      <div className='gnm-earthquakemap'>
        <div className="row no-gutter">
          <div className='col-md-9'>
              <div className='map'></div>
          </div>
          <div className="col-md-3 map-height overflow-scroll">
            <div className='legend'>
              <h5>Recent Earthquakes</h5>
              <div>
                <button type="button" className="btn btn-primary" onClick={this.centerMap}>
                  <h6>Center Map <span className="fa fa-crosshairs"></span> </h6>
                </button>
              </div>
              <div className='toggles'>
                <Toggle default={true} handler={this.toggleHeatMap}>Show Heat Map</Toggle>
                  <label name="daysAgo" className='range-title'>Last {this.state.daysAgo} Days</label>
                  <input type="range" name="daysAgo" min='1' max ='60' step='1' value={this.state.daysAgo} onChange={(e)=>{
                      console.log('changed daysAgo')
                      this.setState({daysAgo: e.target.value} )
                    }} />
                  <label name="magnitude" className='range-title'>Minimum {this.state.minimumMagnitude} Magnitude</label>
                  <input name='magnitude' className= 'over' type="range" min='2' max ='7' defaultValue='0' onChange={(e)=>{
                      this.setState({minimumMagnitude: e.target.value })
                    }}  />
              </div>
            </div>
            <ul className='list'>
              {this.state.earthquakes.sort(function(a,b){ return a.timeStamp > b.timeStamp ? -1 : 1}).map((e,i,a)=>{
                return(
                  <li key={i} style={{backgroundColor: i%2 == 0 ? '#e5e5e5' : 'none'}} onClick={()=>{
                      this.clickMarker(e,i)
                    }}>
                    <h6>
                      <span className='fa fa-bullseye'></span>{e.magnitude} Magnitude
                    </h6>
                    <div className='sixteen-font'>{e.title}</div>
                    <div className='forteen-font'>{e.felt || 0} {e.felt==1 ? 'person' : 'people'} reported this quake</div>
                    <div className=' date'>{e.date.toLocaleString()}</div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

      </div>)
  }
}

export default EarthquakeMap
