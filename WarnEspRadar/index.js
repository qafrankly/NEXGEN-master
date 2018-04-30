import React, {Component} from 'react';


class WarnEspRadar extends Component {
  constructor(props){
    super(props);
    /* WARN is News on 6
      ESP is News 9 */
    this.state ={
      featureSrc : props.stateWideLarge,
      mounted: false,
      radars: props.radars || []
    }
    this.uid = Date.now()
  }

  componentDidMount(){
    /* don't want to inject iframe until we are actually ready */
    this.setState({mounted: true})
  }

  makeFeature(i){
    this.uid = Date.now()
    this.setState({
      featureSrc: this.state.radars[i].large,
      radars:this.state.radars
    })
    document.body.scrollTop = document.documentElement.scrollTop = 0
  }

  backToDefault(){
    this.uid = Date.now()
    this.setState({
      featureSrc: props.stateWideLarge
    })
    document.body.scrollTop = document.documentElement.scrollTop = 0
  }

  iframe(){ //only so we don't have to make all these requests at small sizes
    if(typeof window !== 'object')
      return null
    if(window.innerWidth > 990) //why not 995? I don't know, but no reason to split hairs here, just for performance
      return <iframe id="betaRadarFrame"
            src={this.props.iframeSrc}
            border="0" width="964" height="644" scrolling="no"
            style={{border:'0px'}}></iframe>
  }

  render(){
    if(this.state.mounted && typeof window === 'object')
      return (
        <div className='gnm-warn-esp-radar'>
          <div className="row">
            <div className="col-md-12 hidden-xs hidden-sm">
              {this.iframe()}
            </div>
            <div className="col-xs-12 visible-xs-block visible-sm-block">
              <div className="row">
                <div className="col-xs-12">
                  <h1>Radar</h1>
                  <img src={this.state.featureSrc + this.uid} className="img-responsive feature" alt=""/>
                </div>
                <div className="col-xs-12">
                  <img src="http://m.newson6.com/images/radar_legend.png" alt="Radar Legend" className="legend img-responsive" />
                </div>
                <div className="col-xs-12">
                  <div className="row">
                    <div className="col-xs-4 col-sm-3  smallRadar">
                      <img src={this.props.stateWideSmall + this.uid} onClick={this.backToDefault.bind(this)} alt="Statewide Radar" className="img-responsive"/>
                      <h6>Statewide</h6>
                    </div>
                    {this.state.radars.map((r,i,a)=>{
                      return(
                        <div className="col-xs-4 col-sm-3  smallRadar" key={i} onClick={this.makeFeature.bind(this, i)}>
                            <img src={r.small + this.uid} alt="Statewide Radar" className="img-responsive"/>
                            <h6>{r.name}</h6>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    return null
    }

}

export default WarnEspRadar;
