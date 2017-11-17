import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class BatchDetailView extends Component {
  static propTypes = {
    match: PropTypes.object
  }
  render () {
    console.log(this.props.match.params)
    return (
      <h1>批次详情页</h1>
    )
  }
}
