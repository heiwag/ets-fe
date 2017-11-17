import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import { Table, Form, Row, Col, Button } from 'antd'

import './PointTrackView.scss'

// const FormItem = Form.Item
// const Option = Select.Option
// const { RangePicker } = DatePicker

class PointTrackView extends Component {
  static propTypes = {
    form: PropTypes.object,
    history: PropTypes.object
    // batchList: PropTypes.object,
    // tableData: PropTypes.object,
    // totalCount: PropTypes.number,
    // pageSize: PropTypes.number,
    // loading: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.state = {
      expand: false
    }
  }

  componentWillMount () {
    // this.props.batchList.getTableData({ pageIndex: 1 })
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

  // handleSearch = (e) => {
  //   e.preventDefault()
  //   this.props.form.validateFields((err, values) => {
  //     if (err) return
  //     if (!_.isEmpty(values.createtime)) {
  //       const [ startTime, endTime ] = values.createtime
  //       values.createtime = [
  //         startTime.startOf('day').format('YYYY-MM-DD HH:mm'),
  //         endTime.add(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm')
  //       ]
  //     } else {
  //       delete values.createtime
  //     }
  //     if (!_.isEmpty(values.frozetime)) {
  //       const [ startTime, endTime ] = values.frozetime
  //       values.frozetime = [
  //         startTime.startOf('day').format('YYYY-MM-DD HH:mm'),
  //         endTime.add(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm')
  //       ]
  //     } else {
  //       delete values.frozetime
  //     }
  //     if (values.status === '-1') {
  //       delete values.status
  //     }
  //     if (values.channel === '-1') {
  //       delete values.channel
  //     }
  //     values.pageIndex = 1
  //     this.props.batchList.getTableData(values)
  //   })
  // }

  hanlerTablePermeterChange = (pagination, filters, sorter) => {
    // const { current } = pagination
    // this.props.batchList.getTableData({pageIndex: current})
  }

  render () {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Age', dataIndex: 'age', key: 'age' },
      { title: 'Address', dataIndex: 'address', key: 'address' },
      { title: 'Action', dataIndex: '', key: 'x', render: () => <a href="#">Delete</a> }
    ]

    const data = [
      { key: 1, name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park', description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' },
      { key: 2, name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park', description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.' },
      { key: 3, name: 'Joe Black', age: 32, address: 'Sidney No. 1 Lake Park', description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.' }
    ]

    return (
      <div>
        <Row className="point_track-table-operator">
          <Col span={6}>
            <Button type="primary" icon="plus" size="large" onClick={this.handlerNew}>新建</Button>
          </Col>
        </Row>
        <Table
          className="point_track-table"
          columns={columns}
          expandedRowRender={record => <p>{record.description}</p>}
          dataSource={data}
        />
      </div>
    )
  }
}

export default inject(
  stores => ({
  })
)(observer(Form.create()(PointTrackView)))
