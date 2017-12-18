import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
// import moment from 'moment'
// import _ from 'lodash'
import { observer, inject } from 'mobx-react'
import {
  Table, Form, Row, Col,
  Button, Input, Select,
  Tag, Icon
} from 'antd'

import './PointTestVIew.scss'

import { channelTable, businessLineTable } from '../../utils/stringTable'

const FormItem = Form.Item
const Option = Select.Option
// const { RangePicker } = DatePicker

class PointTestView extends Component {
  static propTypes = {
    form: PropTypes.object,
    history: PropTypes.object,
    testList: PropTypes.object,
    tableData: PropTypes.object,
    batchList: PropTypes.object,
    totalCount: PropTypes.number,
    pageSize: PropTypes.number,
    pageIndex: PropTypes.number,
    loading: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.state = {
      expand: false
    }
    this.props.testList.fetchBatchByChannelAndStatus([0, 1, 2])
  }

  componentDidMount () {
    this.searchTable(1)
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

      if (values.business_line === '-1') {
        delete values.business_line
      }

      if (values.channel === '-1') {
        delete values.channel
      }

      if (values.batch_id === '-1') {
        delete values.batch_id
      }

      if (values.device_type === '-1') {
        delete values.device_type
      }

      if (values.enum_status === '-1') {
        delete values.enum_status
      }

      values.pageIndex = pageIndex
      this.props.testList.getTableData(values)
    })
  }

  handleReset = () => {
    this.props.form.resetFields()
  }

  handleSearch = (e) => {
    this.props.testList.setPageIndex(1)
    e.preventDefault()
    this.searchTable(1)
  }

  hanlerTablePermeterChange = (pagination, filters, sorter) => {
    const { current } = pagination
    this.props.testList.setPageIndex(current)
    this.searchTable(current)
  }

  handleDetail = (record) => {
    const { batchid } = record
    this.props.history.push({ pathname: `/home/batch/detaile/${batchid}` })
  }

  handleModalOk = () => {

  }

  render () {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    const { getFieldDecorator } = this.props.form
    const columns = [{
      title: 'eventKey',
      dataIndex: 'eventkey',
      key: 'eventkey'
    },
    { title: 'desc', dataIndex: 'desc', key: 'desc' },
    {
      title: '枚举值状态',
      dataIndex: 'enum_status',
      key: 'enum_status',
      render: (text, record) => {
        switch (record.enum_status) {
          case -1: return '-'
          case 0: return <Tag color="orange">未校验</Tag>
          case 1: return <Tag color="green">校验通过</Tag>
          case 2: return <Tag color="red">校验未通过</Tag>
        }
      }
    },
    { title: '是否通过',
      render: (text, record) => {
        if (parseInt(record.totalCount, 10) === 0) {
          return <Tag color="orange">埋点尚未触发</Tag>
        }
        if (record.errorCount.toString() === '0') {
          return <Tag color="green">通过</Tag>
        } else {
          return <Tag color="red">异常</Tag>
        }
      }
    }, {
      title: '错误比例',
      dataIndex: 'totalCount',
      key: 'totalCount',
      render: (text, record) => {
        if (parseInt(record.totalCount, 10) === 0) {
          return <span> - </span>
        }
        const ratio = Math.floor((record.errorCount / record.totalCount) * 100)
        let ratioColor
        if (ratio === 0) ratioColor = 'green'
        else ratioColor = 'red'
        return (
          <span>
            <span><Tag color="blue">{`${record.errorCount}/${record.totalCount}`}</Tag></span>
            <span><Tag color={ratioColor}>{`${ratio}%`}</Tag></span>
          </span>
        )
      }
    },
    { title: '埋点类别',
      dataIndex: 'channel',
      key: 'channel',
      render: (text) => {
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
    }, { title: '所属分线',
      dataIndex: 'business_line',
      key: 'business_line',
      render: (text) => (businessLineTable[text])
    }, { title: '发送设备类型',
      dataIndex: 'device_type',
      key: 'device_type',
      render: (text, record) => {
        if (text === 'ios') {
          return <Icon type="apple" />
        } else if (text === 'android') {
          return <Icon type="android" />
        } else if (text === 'pc') {
          return <Icon type="chrome" />
        } else if (text === 'h5') {
          return <Icon type="html5" />
        }
      }
    }, { title: '批次名称',
      dataIndex: 'batchName',
      key: 'batchName',
      render: (text, record) => <span>{this.props.batchList.slice().filter(x => x.batchid === record.batch_id)[0].name}</span>
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <Link target="_blank" to={{ pathname: `/home/point-test/detail/${record.pointid}/${record.channel}` }}>Detail</Link>
          <span className="ant-divider" />
          <Link target="_blank" to={{ pathname: `/home/point-track/detaile/${record.pointid}` }}>查看埋点定义</Link>
          { record.enum_status > -1 ? <span className="ant-divider" /> : null }
          { record.enum_status > -1 ? <Link target="_blank" to={{ pathname: `/home/point-test/enum/${record.pointid}` }}>Enum</Link> : null }
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
              <FormItem {...formItemLayout} label="批次">
                {getFieldDecorator('batch_id', { initialValue: '-1' })(
                  <Select>
                    <Option value="-1">全部</Option>
                    {
                      this.props.batchList.slice().filter(x => x.status === 0).map(item => (
                        <Option key={item.batchid} value={item.batchid}>{`${channelTable[item.channel]} - ${item.name}`}</Option>
                      ))
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
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
              <FormItem {...formItemLayout} label="分线">
                {getFieldDecorator('business_line', { initialValue: '-1' })(
                  <Select
                    placeholder="请选择"
                  >
                    <Option value="-1">全部</Option>
                    <Option value="1">引导体系线</Option>
                    <Option value="2">专业能力线</Option>
                    <Option value="3">情感能力线</Option>
                    <Option value="4">产品运营线</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label="枚举状态">
                {getFieldDecorator('enum_status', { initialValue: '-1' })(
                  <Select
                    placeholder="请选择"
                  >
                    <Option value="-1">全部</Option>
                    <Option value="1">枚举正常</Option>
                    <Option value="0">枚举异常</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label="设备类型">
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
              <FormItem {...formItemLayout} label="埋点eventKey">
                {getFieldDecorator('eventkey')(
                  <Input placeholder="请输入" />
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
              {/* <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
                Collapse <Icon type={this.state.expand ? 'up' : 'down'} />
              </a> */}
            </Col>
          </Row>
        </Form>
        <Table
          className="test-table"
          columns={columns}
          dataSource={this.props.tableData.slice()}
          rowKey={record => `${record.d_type}-${record.pointid}`}
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
    testList: stores.testListStore,
    tableData: stores.testListStore.tableData,
    totalCount: stores.testListStore.totalCount,
    pageSize: stores.testListStore.pageSize,
    pageIndex: stores.testListStore.pageIndex,
    loading: stores.testListStore.loading,
    batchList: stores.testListStore.batchList,
    modalVisible: stores.testListStore.modalVisible
  })
)(observer(Form.create({
  onFieldsChange (props, fields) {
    props.testList.setField(fields)
  },
  mapPropsToFields (props) {
    // const { username, password, remember } = props.loginStore
    return props.testList.formData
  }
})(PointTestView)))
