import React from 'react'
import engine from '../../main/engine'

class Button extends React.Component {
  onClick: () => void
  render() {
    let classNames = []
    classNames = classNames.concat(this.props.classNames)
    return (
      <div onClick={this.onClick} className={`${classNames.join(' ')}`}></div>
    )
  }
}

import store from '../../main/store'
export class ExecButton extends Button {
  constructor(props) {
    super(props)
    this.onClick = () => {
      engine.exec()
    }
  }
}