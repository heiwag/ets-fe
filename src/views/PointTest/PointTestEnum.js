import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import {
  Row, Col, Card, Button, Tag,
  message
} from 'antd'

@inject(stores => ({
  testListStore: stores.testListStore,
  enumStatus: stores.testListStore.enumStatus,
  enumSuccess: stores.testListStore.enumSuccess
}))
@observer
export default class PointTestEnum extends Component {
  static propTypes = {
    // form: PropTypes.object,
    // history: PropTypes.object,
    testListStore: PropTypes.object,
    match: PropTypes.object,
    enumStatus: PropTypes.object,
    enumSuccess: PropTypes.bool
  }

  constructor (props) {
    super(props)
    const { pointId } = this.props.match.params
    this.pointId = pointId
  }

  componentWillMount () {
    this.props.testListStore.verifyEnum(this.pointId).then(res => {
      if (res) {
        message.success('枚举值正常!', 2)
      } else {
        message.error('检测到枚举值异常!', 2)
      }
    })
  }

  handlerRecalcStatus = () => {
    this.props.testListStore.verifyEnum(this.pointId).then(res => {
      if (res) {
        message.success('枚举值正常!', 2)
      } else {
        message.error('检测到枚举值异常!', 2)
      }
    })
  }

  renderEnumStatus = (enumStatus) => {
    return <pre>{JSON.stringify(enumStatus, null, '\t')}</pre>
  }

  renderEnumCurrentStatus = () => {
    const enumStatus = this.props.enumSuccess
    if (enumStatus) {
      return <Tag color="green">校验通过</Tag>
    }
    return <Tag color="red">校验未通过</Tag>
  }

  render () {
    return (
      <div>
        <Row>
          <Col span={24}>
            <Card title="操作">
              <Row>
                <Col span={24}>
                  <span>当前状态：</span>
                  {this.renderEnumCurrentStatus()}
                </Col>
              </Row>
              <Row style={{ marginTop: 16 }}>
                <Col>
                  <Button type="primary" onClick={this.handlerRecalcStatus}>重新计算枚举值状态</Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card title="枚举状态">
              { this.renderEnumStatus(this.props.enumStatus) }
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}
