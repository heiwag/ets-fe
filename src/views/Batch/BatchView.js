import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import moment from 'moment'
import _ from 'lodash'
import { observer, inject } from 'mobx-react'
import {
  Table, Icon, Form, Row, Col,
  Button, Input, Select, DatePicker,
  Badge, Tag
} from 'antd'

import './BatchView.scss'

const FormItem = Form.Item
const Option = Select.Option
const { RangePicker } = DatePicker

class BatchView extends Component {
  static propTypes = {
    form: PropTypes.object,
    history: PropTypes.object,
    batchList: PropTypes.object,
    tableData: PropTypes.object,
    totalCount: PropTypes.number,
    pageSize: PropTypes.number,
    loading: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.state = {
      expand: false
    }
  }

  componentWillMount () {
    this.props.batchList.getTableData({ pageIndex: 1 })
  }

  toggle = () => {
    const { expand } = this.state
    this.setState({ expand: !expand })
  }

  handleReset = () => {
    this.props.form.resetFields()
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (err) return
      if (!_.isEmpty(values.createtime)) {
        const [ startTime, endTime ] = values.createtime
        values.createtime = [
          startTime.startOf('day').format('YYYY-MM-DD HH:mm'),
          endTime.add(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm')
        ]
      } else {
        delete values.createtime
      }
      if (!_.isEmpty(values.frozetime)) {
        const [ startTime, endTime ] = values.frozetime
        values.frozetime = [
          startTime.startOf('day').format('YYYY-MM-DD HH:mm'),
          endTime.add(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm')
        ]
      } else {
        delete values.frozetime
      }
      if (values.status === '-1') {
        delete values.status
      }
      if (values.channel === '-1') {
        delete values.channel
      }
      values.pageIndex = 1
      this.props.batchList.getTableData(values)
    })
  }

  hanlerTablePermeterChange = (pagination, filters, sorter) => {
    const { current } = pagination
    this.props.batchList.getTableData({pageIndex: current})
  }

  handleDetail = (record) => {
    const { batchid } = record
    this.props.history.push({ pathname: `/home/batch/detaile/${batchid}` })
  }

  render () {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    const { getFieldDecorator } = this.props.form
    const columns = [{
      title: '批次名称',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '类型',
      dataIndex: 'channel',
      key: 'channel',
      render: (text) => (
        (text === 1)
          ? <Tag color="blue">Mobile</Tag>
          : <Tag color="green">PC</Tag>
      )
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        (text === 0)
          ? <Badge status="processing" text="Processing" />
          : <Badge status="success" text="Complete" />
      )
    }, {
      title: '创建时间',
      dataIndex: 'createtime',
      key: 'createtime',
      render: (text) => (
        <span>{moment(text).format('YYYY-MM-DD H:mm')}</span>
      )
    }, {
      title: '完成时间',
      dataIndex: 'frozetime',
      key: 'frozetime',
      render: (text) => (
        <span>{text ? moment(text).format('YYYY-MM-DD H:mm') : '-'}</span>
      )
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <Link to={{ pathname: `/home/batch/detail/${record.batchid}` }}>Detaile</Link>
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
              <FormItem {...formItemLayout} label="批次类型">
                {getFieldDecorator('channel', { initialValue: '-1' })(
                  <Select
                    placeholder="请选择"
                  >
                    <Option value="-1">全部</Option>
                    <Option value="1">Mobile</Option>
                    <Option value="2">PC</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label="使用状态">
                {getFieldDecorator('status', { initialValue: '-1' })(
                  <Select
                    placeholder="请选择"
                  >
                    <Option value="-1">全部</Option>
                    <Option value="0">Processing</Option>
                    <Option value="1">Complete</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label="批次名称">
                {getFieldDecorator('name')(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col span={8} style={{ display: this.state.expand ? 'block' : 'none' }}>
              <FormItem {...formItemLayout} label="批次编号">
                {getFieldDecorator('batchid')(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col span={8} style={{ display: this.state.expand ? 'block' : 'none' }} >
              <FormItem {...formItemLayout} label="创建日期">
                {getFieldDecorator('createtime')(
                  <RangePicker
                    placeholder={['开始日期', '结束时间']}
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                    showTime={false}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8} style={{ display: this.state.expand ? 'block' : 'none' }} >
              <FormItem {...formItemLayout} label="完成日期">
                {getFieldDecorator('frozetime')(
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
              <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
                Collapse <Icon type={this.state.expand ? 'up' : 'down'} />
              </a>
            </Col>
          </Row>
        </Form>
        <Row className="batch-table-operator">
          <Col span={6}>
            <Button type="primary" icon="plus" size="large">新建</Button>
          </Col>
        </Row>
        <Table
          className="batch-table"
          columns={columns}
          dataSource={this.props.tableData.slice()}
          rowKey="batchid"
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
    batchList: stores.batchListStore,
    tableData: stores.batchListStore.tableData,
    totalCount: stores.batchListStore.totalCount,
    pageSize: stores.batchListStore.pageSize,
    loading: stores.batchListStore.loading
  })
)(observer(Form.create()(BatchView)))
