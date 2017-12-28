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

import { channelTable, businessLineTable } from '../../utils/stringTable'

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
    pageIndex: PropTypes.number,
    batchList: PropTypes.object,
    loading: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.state = {
      expand: false
    }
    this.props.trackList.fetchBatchByChannelAndStatus([0, 1, 2])
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

  searchTable = (pageIndex = 1) => {
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
      if (values.business_line === '-1') {
        delete values.business_line
      }
      if (values.batch_id === '-1') {
        delete values.batch_id
      }
      values.pageIndex = pageIndex
      this.props.trackList.fetTableList(values)
    })
  }

  handleSearch = (e) => {
    e.preventDefault()
    this.props.trackList.setPageIndex(1)
    this.searchTable(1)
  }

  hanlerTablePermeterChange = (pagination, filters, sorter) => {
    const { current } = pagination
    this.props.trackList.setPageIndex(current)
    this.searchTable(current)
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
      { title: 'desc', dataIndex: 'desc', key: 'desc' },
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
        render: (text) => {
          if (text.toString() === '2') {
            return <Tag color="blue">Android</Tag>
          } else if (text.toString() === '3') {
            return <Tag color="green">iOS</Tag>
          } else if (text.toString() === '4') {
            return <Tag color="purple">PC</Tag>
          } else if (text.toString() === '5') {
            return <Tag color="orange">H5</Tag>
          }
        }
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
      { title: '公共埋点',
        dataIndex: 'hascommon',
        key: 'hascommon',
        render: (text) => (
          (text === 1)
            ? <Tag color="blue">有</Tag>
            : <Tag color="green">无</Tag>
        )
      },
      { title: '所属分线',
        dataIndex: 'business_line',
        key: 'business_line',
        render: (text) => (businessLineTable[text])
      },
      { title: '批次名称',
        dataIndex: 'batchName',
        key: 'batchName',
        render: (text) => <span>{text}</span>
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
            <Link to={{ pathname: `/home/point-track/detail/${record.pointid}` }} target="_blank">Detail</Link>
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
                    <Option value="2">Android</Option>
                    <Option value="3">iOS</Option>
                    <Option value="4">PC</Option>
                    <Option value="5">H5</Option>
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
              <FormItem {...formItemLayout} label="分线">
                {getFieldDecorator('business_line')(
                  <Select
                    placeholder="请选择"
                  >
                    <Option value="-1">全部</Option>
                    <Option value="1">引导体系线</Option>
                    <Option value="2">专业能力线</Option>
                    <Option value="3">情感能力线</Option>
                    <Option value="4">产品运营线</Option>
                    <Option value="5">家长线</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label="批次">
                {getFieldDecorator('batch_id')(
                  <Select>
                    <Option value="-1">全部</Option>
                    {
                      this.props.batchList.slice().map(item => (
                        <Option key={item.batchid} value={item.batchid}>{`${channelTable[item.channel]} - ${item.name}`}</Option>
                      ))
                    }
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
            <Col span={8}>
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
          rowKey={(record) => `${record.pointid}-${record.channel}-${record.device_id}`}
          loading={this.props.loading}
          dataSource={this.props.tableData.slice()}
          pagination={{ current: this.props.pageIndex, pageSize: this.props.pageSize, total: this.props.totalCount }}
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
    pageIndex: stores.trackList.pageIndex,
    totalCount: stores.trackList.totalCount,
    loading: stores.trackList.loading,
    batchList: stores.trackList.batchList
  })
)(observer(Form.create()(PointTrackView)))
