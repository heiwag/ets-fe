import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import moment from 'moment'
import { observer, inject } from 'mobx-react'
import {
  Table, Form, Row, Col, Button,
  Select, Tag, Icon, DatePicker,
  Modal
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
    loading: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.state = { expand: false }
    const { pointId, deviceType } = this.props.match.params
    this.pointId = pointId
    this.deviceType = deviceType
  }

  componentWillMount () {
    this.props.testDetailStore.getTableData({
      pageIndex: 1,
      point_id: this.pointId,
      device_type: this.deviceType
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
      values.device_type = this.deviceType
      this.props.testDetailStore.getTableData(values)
    })
  }

  handleReset = () => {
    this.props.form.resetFields()
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.searchTable(1)
  }

  hanlerTablePermeterChange = (pagination, filters, sorter) => {
    const { current } = pagination
    this.searchTable(current)
  }

  handlerPointDefine = (record) => {
    this.props.history.push({ pathname: `/home/point-track/detaile/${this.pointId}` })
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
    const columns = [{ title: '是否通过',
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
      dataIndex: 'device_type',
      key: 'device_type',
      render: (text, record) => {
        if (text === 'ios') {
          return <Icon type="apple" />
        } else if (text === 'android') {
          return <Icon type="android" />
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
          <Col span={6}>
            <Button type="primary" icon="bulb" size="large" onClick={this.handlerPointDefine}>查看埋点定义</Button>
          </Col>
        </Row>
        <Table
          className="test-table"
          columns={columns}
          dataSource={this.props.tableData.slice()}
          rowKey="event_id"
          expandedRowRender={(record) => <p>{record.desc}</p>}
          pagination={{ pageSize: this.props.pageSize, total: this.props.totalCount }}
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
    loading: stores.testDetailStore.loading
  })
)(observer(Form.create()(PointTestDetail)))
