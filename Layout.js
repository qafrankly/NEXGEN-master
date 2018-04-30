'use strict';

import React, {Component} from 'react';
import {Link} from 'react-router';
import Footer from './Footer/index';
import Header from './Header/index';
import DataStore from './DataStore'
/* The layout only runs on ours server */

export default class Layout extends Component {
  constructor(props){
    super(props)
    console.log('Visiting Page with Top Level Component ', this.props.routes[1].page)
  }


  render() {
    return (
      <div >
        <Header {...DataStore.defaultProps('Header')}/>
        <div id='gnm-main-body'>
          <div className='gnm-home container'>
            <div className='row'>
              <div className='frn-u-grid-gutter-xs col-xs-12'>
                {React.cloneElement(this.props.children, DataStore.defaultProps(this.props.routes[1].page) )}
              </div>
            </div>
          </div>
        </div>
        <div className='frankly-core-ComponentContainer'>
          <div className='frn-u-grid-gutter-lg col-xl-12 '>
            <Footer {...DataStore.defaultProps('Footer')} />
          </div>
        </div>

      </div>
    );
  }
}
