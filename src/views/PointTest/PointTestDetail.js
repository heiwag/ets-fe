import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import moment from 'moment'
import { observer, inject } from 'mobx-react'
import {
  Table, Form, Row, Col, Button,
  Select, Tag, DatePicker,
  Modal, message
} from 'antd'

import './PointTestVIew.scss'

const FormItem = Form.Item
const Option = Select.Option
const { RangePicker } = DatePicker

class PointTestDetail extends Component {
  static propTypes = {
    form: PropTypes.object,
    history: PropTypes.object,
    match: PropTypes.object,
    testDetailStore: PropTypes.object,
    tableData: PropTypes.object,
    totalCount: PropTypes.number,
    pageSize: PropTypes.number,
    pageIndex: PropTypes.number,
    loading: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.state = { expand: false }
    const { pointId, channel } = this.props.match.params
    this.pointId = pointId
    this.channel = channel
  }

  componentWillMount () {
    this.props.testDetailStore.getTableData({
      pageIndex: 1,
      point_id: this.pointId,
      channel: this.channel
    })
  }

  toggle = () => {
    const { expand } = this.state
    this.setState({ expand: !expand })
  }

  searchTable = (pageIndex) => {
    this.props.form.validateFields((err, values) => {
      if (err) return

      if (values.pass_status === '-1') {
        delete values.pass_status
      } else {
        values.pass_status = !!parseInt(values.pass_status, 10)
      }

      if (!_.isEmpty(values.create_time)) {
        const [ startTime, endTime ] = values.create_time
        values.create_time = [
          startTime.startOf('day').format('YYYY-MM-DD HH:mm'),
          endTime.add(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm')
        ]
      } else {
        delete values.createtime
      }

      values.pageIndex = pageIndex
      values.point_id = this.pointId
      values.channel = this.channel
      this.props.testDetailStore.getTableData(values)
    })
  }

  handleReset = () => {
    this.props.form.resetFields()
  }

  handleSearch = (e) => {
    this.props.testDetailStore.setPageIndex(1)
    e.preventDefault()
    this.searchTable(1)
  }

  hanlerTablePermeterChange = (pagination, filters, sorter) => {
    const { current } = pagination
    this.props.testDetailStore.setPageIndex(current)
    this.searchTable(current)
  }

  handlerPointDefine = (record) => {
    this.props.history.push({ pathname: `/home/point-track/detaile/${this.pointId}` })
  }

  handlerDeleteOne = (record) => {
    this.props.testDetailStore.deleteOne(record.event_id).then(() => {
      message.success('删除成功!', 2)
    }).catch(() => {
      message.success('删除失败!', 2)
    })
  }

  handlerKeepOne = () => {
    this.props.testDetailStore.keepNumber(this.pointId, this.channel, 1).then(() => {
      message.success('删除成功!', 2)
    }).catch(() => {
      message.success('删除失败!', 2)
    })
  }

  handlerDeleteErrorEvents = () => {
    this.props.testDetailStore.deleteEvent(this.pointId, this.deviceType).then(() => {
      message.success('删除成功!', 2, () => {
        this.props.history.go(-1)
      })
    }).catch(() => {
      message.success('删除失败!', 2, () => {
        this.props.history.go(-1)
      })
    })
  }

  handlerPointResult = (record) => {
    Modal.info({
      title: '校验结果',
      width: 1000,
      content: (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <pre style={{ flex: 1 }}>
            {JSON.stringify(record.verify_result, null, '\t')}
          </pre>
          <pre style={{ flex: 1 }}>
            {JSON.stringify(record.origin_value, null, '\t')}
          </pre>
        </div>
      ),
      onOk: () => {}
    })
  }

  render () {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    const { getFieldDecorator } = this.props.form
    const columns = [{
      title: 'eventkey', dataIndex: 'eventkey', key: 'eventkey'
    },
    { title: '是否通过',
      dataIndex: 'pass_status',
      key: 'pass_status',
      render: (text, record) => {
        if (record.pass_status) {
          return <Tag color="green">通过</Tag>
        } else {
          return <Tag color="red">异常</Tag>
        }
      }
    }, { title: '设备类型',
      dataIndex: 'channel',
      key: 'channel',
      render: (text, record) => {
        if (text.toString() === '2') {
          return <Tag color="blue">Android</Tag>
        } else if (text.toString() === '3') {
          return <Tag color="green">iOS</Tag>
        } else if (text.toString() === '4') {
          return <Tag color="purple">PC</Tag>
        } else if (text.toString() === '5') {
          return <Tag color="purple">H5</Tag>
        }
      }
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (text) => (
        <span>{moment(text).format('YYYY-MM-DD H:mm')}</span>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="javascript:void(0)" onClick={() => this.handlerPointResult(record)}>查看校验结果</a>
          <span className="ant-divider" />
          <a href="javascript:void(0)" onClick={() => this.handlerDeleteOne(record)}>删除</a>
        </span>
      )
    }]

    return (
      <div>
        <Form
          className="batch-search-form"
          onSubmit={this.handleSearch}
        >
          <Row gutter={10}>
            <Col span={8}>
              <FormItem {...formItemLayout} label="是否通过">
                {getFieldDecorator('pass_status', { initialValue: '-1' })(
                  <Select
                    placeholder="请选择"
                  >
                    <Option value="-1">全部</Option>
                    <Option value="1">正常</Option>
                    <Option value="0">异常</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label="埋入日期">
                {getFieldDecorator('create_time')(
                  <RangePicker
                    placeholder={['开始日期', '结束时间']}
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                    showTime={false}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit">Search</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                Clear
              </Button>
            </Col>
          </Row>
        </Form>
        <Row className="batch-table-operator">
          <Col span={24}>
            <Button type="primary" icon="bulb" size="large" onClick={this.handlerPointDefine}>查看埋点定义</Button>
            <Button type="primary" icon="bulb" size="large" style={{ marginLeft: '8px' }} onClick={this.handlerDeleteErrorEvents}>删除所有埋点</Button>
            <Button type="primary" icon="bulb" size="large" style={{ marginLeft: '8px' }} onClick={this.handlerKeepOne}>保留最后一条</Button>
          </Col>
        </Row>
        <Table
          className="test-table"
          columns={columns}
          dataSource={this.props.tableData.slice()}
          rowKey="event_id"
          pagination={{ current: this.props.pageIndex, pageSize: this.props.pageSize, total: this.props.totalCount }}
          onChange={this.hanlerTablePermeterChange}
          loading={this.props.loading}
        />
      </div>
    )
  }
}

export default inject(
  stores => ({
    testDetailStore: stores.testDetailStore,
    tableData: stores.testDetailStore.tableData,
    totalCount: stores.testDetailStore.totalCount,
    pageSize: stores.testDetailStore.pageSize,
    pageIndex: stores.testDetailStore.pageIndex,
    loading: stores.testDetailStore.loading
  })
)(observer(Form.create()(PointTestDetail)))
