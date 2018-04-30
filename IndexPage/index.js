import React, { Component} from 'react';
import HomePageTakeover from '../HomePageTakeover'
import WeatherTakeover from '../WeatherTakeover'
import TopStories from '../TopStories'
import DataStore from '../DataStore'


export default class IndexPage extends Component{
  constructor(props){
    super(props)
    // this.affiliate = this.props.affiliate
  }


  render() {
    return (
      <div>
        <HomePageTakeover {...DataStore.defaultProps('HomePageTakeover')}/>
        <WeatherTakeover {...DataStore.defaultProps('WeatherTakeover')} />
        <TopStories {...DataStore.defaultProps('TopStories')} />
      </div>
    );
  }
}
