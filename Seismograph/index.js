import React, {Component} from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Label,
  ReferenceLine
} from 'recharts'
import SeismographController from '../SeismographController'
import EarthquakeHistoryController from '../EarthquakeHistoryController'
import EarthquakeController from '../EarthquakeController'

const SEISMOGRAPHFEED = 'http://ftpcontent.worldnow.com/kwtv/custom/earthquake/data.json'

class Seismograph extends Component {

  constructor(props) {
    super(props)
    this.container = false;
    this.state = {
      Samples: []
    }
  }

  componentWillMount() {
    if (typeof window !== 'object')
      return //no server-side at all
    SeismographController.get((current) => { //object
      this.setState(current)
    })
    EarthquakeHistoryController.get((history) => { //object
      var featured = history[history.length - 1]
      this.setState({
        history: history,
        featured: featured
      }, () => {
        this.getEarthquake(featured.Name)
      })
    })
  }

  getEarthquake = (filename) => {
    EarthquakeController.get(filename, (earthquake) => {
      this.setState({featured: earthquake})
    })
  }

  xTickFormatter = (t) => {
    if (t)
      return new Date(t).toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")
    return null
  }

  render() {
    var domain,
      yTicks,
      seismographWidth,
      height,
      featureWidth
    var show = false
    if (this.state.featured) {
      if (this.state.featured.Samples) { //which is to say we have the featured earthquake
        show = true
        domain = [
          this.state.featured.min - 2,
          this.state.featured.max + 2
        ]
        yTicks = [this.state.featured.min, 0, this.state.featured.max]
      }
    }
    if (this.container) {
      height = Math.max(this.container.offsetWidth * 1 / 5, 200)
      if (this.container.offsetWidth > 720) { //larger screens
        seismographWidth = this.container.offsetWidth * 3 / 5
        featureWidth = this.container.offsetWidth - seismographWidth
      } else {
        seismographWidth = featureWidth = this.container.offsetWidth
      }
    }

    return (<div className='gnm-seismograph' ref={(container) => {
        this.container = container;
      }}>
      {
        show && this.container
          ? (<div>
            <LineChart width={seismographWidth} height={height} data={this.state.Samples} style={{
                backgroundColor: '#000000',
                display: 'inline-block'
              }}>
              <ReferenceLine y={domain[1]} stroke="white" strokeWidth={1}/>
              <ReferenceLine x={this.state.Samples.length - 1} stroke="white" strokeWidth={1}/>
              <XAxis dataKey="time" ticks={[this.state.Start, this.state.End]} interval="preserveStartEnd" tickFormatter={this.xTickFormatter} stroke="white">
                <Label value="Current Seismograph" offset={10} position="insideBottom" style={{
                    fill: 'white'
                  }}/>
              </XAxis>
              <YAxis type="number" domain={domain} ticks={yTicks} stroke="white"/>
              <Line type="step" dataKey="value" stroke="#be0000" dot={false} activeDot={false}/>
            </LineChart>
            <LineChart width={featureWidth} height={height} data={this.state.featured.Samples} padding={{
                right: 10
              }} style={{
                backgroundColor: '#000000',
                display: 'inline-block'
              }}>
              <ReferenceLine y={domain[1]} stroke="white" strokeWidth={1}/>
              <ReferenceLine x={this.state.featured.Samples.length - 1} stroke="white" strokeWidth={1}/>
              <XAxis dataKey="time" ticks={[this.state.featured.Start, this.state.featured.End]} interval="preserveStartEnd" tickFormatter={this.xTickFormatter} stroke="white">
                <Label value={(
                    this.container.offsetWidth > 720
                    ? "Last Earthquake "
                    : 'Last ') + this.state.featured.Start.split(' ')[0]} offset={10} position="insideBottom" style={{
                    fill: 'white'
                  }}/>
              </XAxis>
              <YAxis type="number" domain={domain} ticks={yTicks} stroke="white"/>

              <Line type="linear" dataKey="value" stroke="#be0000" dot={false} activeDot={false} strokeWidth={2}/>
            </LineChart>
          </div>)
          : null
      }
    </div>)
  }
}

export default Seismograph
