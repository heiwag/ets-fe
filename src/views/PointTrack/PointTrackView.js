import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import _ from 'lodash'
import { observer, inject } from 'mobx-react'
import { Link } from 'react-router-dom'
import {
  Table, Form, Row, Col, Button,
  Tag, Badge, Input, Select, DatePicker,
  Icon
} from 'antd'

import './PointTrackView.scss'

const FormItem = Form.Item
const Option = Select.Option
const { RangePicker } = DatePicker

// const FormItem = Form.Item
// const Option = Select.Option
// const { RangePicker } = DatePicker

class PointTrackView extends Component {
  static propTypes = {
    form: PropTypes.object,
    history: PropTypes.object,
    trackList: PropTypes.object,
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
    this.props.trackList.fetTableList({ pageIndex: 1 })
  }

  toggle = () => {
    const { expand } = this.state
    this.setState({ expand: !expand })
  }

  handleReset = () => {
    this.props.form.resetFields()
  }

  handlerNew = () => {
    this.props.history.push({ pathname: '/home/point-track/new/0' })
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (err) return
      if (!_.isEmpty(values.updatetime)) {
        values.updatetime = values.updatetime.format('YYYY-MM-DD HH:mm')
      } else {
        delete values.updatetime
      }
      if (values.status === '-1') {
        delete values.status
      }
      if (values.channel === '-1') {
        delete values.channel
      }
      values.pageIndex = 1
      this.props.trackList.fetTableList(values)
    })
  }

  hanlerTablePermeterChange = (pagination, filters, sorter) => {
    const { current } = pagination
    this.props.trackList.fetTableList({pageIndex: current})
  }

  render () {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    const { getFieldDecorator } = this.props.form
    const columns = [
      { title: 'eventkey', dataIndex: 'eventkey', key: 'eventkey' },
      { title: 'category', dataIndex: 'eventcategory', key: 'eventcategory' },
      { title: '版本',
        dataIndex: 'version',
        key: 'version',
        render: (text) => (
          <Tag color="#108ee9">{`v${text}`}</Tag>
        )
      },
      { title: '埋点类别',
        dataIndex: 'channel',
        key: 'chaanel',
        render: (text) => (
          (text === 1)
            ? <Tag color="blue">Mobile</Tag>
            : <Tag color="green">PC</Tag>
        )
      },
      { title: '埋点状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => (
          (text === 1)
            ? <Badge status="success" text="使用中" />
            : <Badge status="warning" text="停止使用" />
        )
      },
      { title: '最后更新时间',
        dataIndex: 'updatetime',
        key: 'updatetime',
        render: (text) => (
          <span>{moment(text).format('YYYY-MM-DD H:mm')}</span>
        )
      }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <Link to={{ pathname: `/home/batch/detail/${record.batchid}` }}>Detaile</Link>
          </span>
        )
      }
    ]

    return (
      <div>
        <Form
          className="batch-search-form"
          onSubmit={this.handleSearch}
        >
          <Row gutter={10}>
            <Col span={8}>
              <FormItem {...formItemLayout} label="埋点类型">
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
                    <Option value="1">使用中</Option>
                    <Option value="0">停止使用</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label="eventKey">
                {getFieldDecorator('eventkey')(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col span={8} style={{ display: this.state.expand ? 'block' : 'none' }}>
              <FormItem {...formItemLayout} label="Category">
                {getFieldDecorator('eventcategory')(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col span={8} style={{ display: this.state.expand ? 'block' : 'none' }}>
              <FormItem {...formItemLayout} label="埋点编号">
                {getFieldDecorator('pointid')(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col span={8} style={{ display: this.state.expand ? 'block' : 'none' }} >
              <FormItem {...formItemLayout} label="修改日期">
                {getFieldDecorator('updatetime')(
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
        <Row className="point_track-table-operator">
          <Col span={6}>
            <Button type="primary" icon="plus" size="large" onClick={this.handlerNew}>新建</Button>
          </Col>
        </Row>
        <Table
          className="point_track-table"
          columns={columns}
          rowKey="pointid"
          loading={this.props.loading}
          expandedRowRender={record => <p>{record.desc}</p>}
          dataSource={this.props.tableData.slice()}
          pagination={{ pageSize: this.props.pageSize, total: this.props.totalCount }}
          onChange={this.hanlerTablePermeterChange}
        />
      </div>
    )
  }
}

export default inject(
  stores => ({
    trackList: stores.trackList,
    tableData: stores.trackList.tableData,
    pageSize: stores.trackList.pageSize,
    totalCount: stores.trackList.totalCount,
    loading: stores.trackList.loading
  })
)(observer(Form.create()(PointTrackView)))
