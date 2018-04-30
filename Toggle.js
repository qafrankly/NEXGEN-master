import React,{Component} from 'react'

class Toggle extends Component{
  constructor(props){
    super(props)
    this.state = {
      checked: props.default ? true : false
    }
    this.outsideHandler = props.handler || function(){}

  }

  toggle = ()=>{
    var checked = !this.state.checked
    this.setState({checked},()=>{
      this.outsideHandler(checked)

      }
    )

  }

  render(){
    return(
      <div className='gnm-toggle'>
        <label className="switch" >
          <input type="checkbox"
            checked={this.state.checked}
            onChange={this.toggle}/>
          <span className="slider round" />
        </label>
        <span className='slider-label'>{this.props.children}</span>
      </div>
    )
  }
}

export default Toggle
