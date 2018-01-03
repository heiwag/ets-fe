import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import _ from 'lodash'
import { observer, inject } from 'mobx-react'
import { Link } from 'react-router-dom'
import {
  Table, Form, Row, Col, Button,
  Tag, Badge, Input, Select, DatePicker,
  Icon, Modal, message
} from 'antd'

import { channelTable, businessLineTable } from '../../utils/stringTable'
import EditableCell from './components/editableCell'

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
    loading: PropTypes.bool,
    allUser: PropTypes.object,
    selectedRowKeys: PropTypes.object,
    selectUserId: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.state = {
      expand: false,
      visible: false
    }
    this.props.trackList.fetchBatchByChannelAndStatus([0, 1, 2])
  }

  componentWillMount () {
    this.props.trackList.fetTableList({ pageIndex: 1 })
    this.props.trackList.getAllUser()
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
    const { current, pageSize } = pagination
    this.props.trackList.setPageSize(pageSize)
    this.props.trackList.setPageIndex(current)
    this.searchTable(current)
  }

  handleHeadDevChange = (pointId, headDev) => {
    this.props.trackList.updatePointHeadDev(pointId, headDev)
  }

  handleSelectChange = (selectedRowKeys) => {
    this.props.trackList.setSelectedRowKeys(selectedRowKeys)
  }

  handlerShowSetPointHeadModel = () => {
    this.setState({ visible: true })
  }

  handlerHideSetPointHeadModel = () => {
    this.setState({ visible: false })
  }

  handlerSetPointsHead = () => {
    const { selectUserId, selectedRowKeys } = this.props
    this.props.trackList
      .updatePointHeadDev(selectedRowKeys.slice(), selectUserId)
      .then(err => {
        if (err) {
          message.error('设置失败!', 3)
        } else {
          message.success('设置成功!', 3)
          this.handlerHideSetPointHeadModel()
          this.props.trackList.updateTableName(selectedRowKeys, selectUserId)
        }
      }, () => message.error('设置失败!', 3))
  }

  handlerCheck = value => {
    this.props.trackList.setSelectUserId(value)
  }

  renderUserSelect = () => {
    const allUser = this.props.allUser.slice()
    return allUser.map(user => (
      <Option key={user.id} value={user.id}>{user.name}</Option>
    ))
  }

  renderSetPointHeadModel = () => {
    return (
      <Modal
        title="批量设置设置埋点负责人"
        visible={this.state.visible}
        onOk={this.handlerSetPointsHead}
        onCancel={this.handlerHideSetPointHeadModel}
      >
        <div>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="选择负责人"
            optionFilterProp="children"
            onChange={this.handlerCheck}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {this.renderUserSelect()}
          </Select>
        </div>
      </Modal>
    )
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
      { title: '负责人',
        dataIndex: 'head_dev',
        key: 'head_dev',
        render: (text, record) => (
          <EditableCell
            allUser={this.props.allUser.slice()}
            value={text}
            onChange={value => this.handleHeadDevChange(record.pointid, value)} />
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

    const rowSelection = {
      selectedRowKeys: this.props.selectedRowKeys.slice(),
      onChange: this.handleSelectChange
    }

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
          <Col span={24}>
            <Button
              type="primary"
              icon="plus"
              size="large"
              onClick={this.handlerNew}>新建</Button>
            <Button
              style={{ marginLeft: 8 }}
              type="primary"
              icon="usergroup-add"
              size="large"
              disabled={!this.props.selectedRowKeys.slice().length > 0}
              onClick={this.handlerShowSetPointHeadModel}>批量设置负责人</Button>
          </Col>
        </Row>
        <Table
          className="point_track-table"
          columns={columns}
          rowKey={(record) => `${record.pointid}`}
          loading={this.props.loading}
          dataSource={this.props.tableData.slice()}
          pagination={{
            current: this.props.pageIndex,
            defaultPageSize: 10,
            total: this.props.totalCount,
            showSizeChanger: true
          }}
          onChange={this.hanlerTablePermeterChange}
          rowSelection={rowSelection}
        />
        {this.renderSetPointHeadModel()}
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
    batchList: stores.trackList.batchList,
    allUser: stores.trackList.allUser,
    selectedRowKeys: stores.trackList.selectedRowKeys,
    selectUserId: stores.trackList.selectUserId
  })
)(observer(Form.create()(PointTrackView)))
