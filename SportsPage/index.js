import React, { Component} from 'react';

export default class SportsPage extends Component{
  constructor(props){
    super(props)
    this.affiliate = this.props.affiliate
  }

  render() {
    return (
      <div >
        sports page!
      </div>
    );
  }

}
