import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import { Row, Col, Card } from 'antd'

@inject(stores => ({
  testListStore: stores.testListStore,
  enumStatus: stores.testListStore.enumStatus
}))
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
    return <pre>{JSON.stringify(enumStatus, null, '\t')}</pre>
  }

  render () {
    return (
      <Row>
        <Col span={24}>
          <Card title="枚举状态">
            { this.renderEnumStatus(this.props.enumStatus) }
          </Card>
        </Col>
      </Row>
    )
  }
}
