import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'

@inject(stores => ({ testListStore: stores.testListStore, enumStatus: stores.testListStore.enumStatus }))
@observer
export default class PointTestEnum extends Component {
  static propTypes = {
    // form: PropTypes.object,
    // history: PropTypes.object,
    testListStore: PropTypes.object,
    match: PropTypes.object,
    enumStatus: PropTypes.object
  }

  constructor (props) {
    super(props)
    const { pointId } = this.props.match.params
    this.pointId = pointId
  }

  componentWillMount () {
    this.props.testListStore.verifyEnum(this.pointId)
  }

  renderEnumStatus = (enumStatus) => {
    return <code>{JSON.stringify(enumStatus)}</code>
  }

  render () {
    return this.renderEnumStatus(this.props.enumStatus)
  }
}
