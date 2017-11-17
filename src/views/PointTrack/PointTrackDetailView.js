import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import {
  Form, Card, Col, Row, Input,
  Radio, Tag, Popover, Table,
  Switch, Select, Button, Modal
} from 'antd'

const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option

class PointTrackDetailView extends Component {
  static propTypes = {
    match: PropTypes.object,
    form: PropTypes.object,
    history: PropTypes.object,
    trackDetailStore: PropTypes.object,
    pointProps: PropTypes.array,
    isEditor: PropTypes.bool
  }

  constructor (props) {
    super(props)
    const { action, batchId } = this.props.match.params
    this.batchId = batchId
    this.isNew = action === 'new'
  }

  handleAddProp = () => {
    this.props.trackDetailStore.addProp()
  }

  handleRemoveProp = (uid) => {
    this.props.trackDetailStore.removeProp(uid)
  }

  handlerTableChange = (record, value, key) => {
    this.props.trackDetailStore.setPropValue(record, value, key)
  }

  handlerEnumTableChange = (parentUid, record, value, key) => {
    this.props.trackDetailStore.setEnumPropValue(parentUid, record, value, key)
  }

  handleAddEnumList = (uid) => {
    this.props.trackDetailStore.addEnumList(uid)
  }

  handlerSubmitPoint = () => {
    this.props.form.validateFieldsAndScroll((err) => {
      if (err) return
      const formData = this.props.form.getFieldsValue()
      this.props.trackDetailStore.submit(formData).then(res => {
        if (res) {
          this.props.history.replace({ pathname: '/home/point-track/new/0' })
          // Modal.success({
          //   title: 'Success',
          //   content: '保存成功'
          // })
        } else {
          Modal.error({
            title: 'Error',
            content: '保存失败'
          })
        }
      })
    })
  }

  renderInputColumns = (text, record, key) => {
    if (this.props.isEditor) {
      return (
        <Input placeholder="请输入" defaultValue={record[key]} onChange={(e) => this.handlerTableChange(record, e.target.value, key)} />
      )
    }

    return (
      <span>{record[key]}</span>
    )
  }

  renderEnumColumns = (parentId, record, key) => {
    if (this.props.isEditor) {
      return (
        <Input placeholder="请输入" defaultValue={record[key]} onChange={(e) => this.handlerEnumTableChange(parentId, record, e.target.value, key)} />
      )
    }

    return (
      <span>{record[key]}</span>
    )
  }

  renderSelectColumns = (text, record, key) => {
    if (this.props.isEditor) {
      return (
        <Select defaultValue={text} onChange={(value) => this.handlerTableChange(record, value, key)}>
          <Option value="string">String</Option>
          <Option value="number">Number</Option>
          <Option value="enum">Enum</Option>
          <Option value="bool">Boolean</Option>
          <Option value="object">Object</Option>
        </Select>
      )
    }

    return (
      <span>{text}</span>
    )
  }

  renderSwitchColumns = (text, record, key) => {
    if (this.props.isEditor) {
      return (
        <Switch onChange={(value) => this.handlerTableChange(record, value, key)} defaultChecked={record.isRequire} checkedChildren="Y" unCheckedChildren="N" />
      )
    }

    return (
      <span>
        {
          record.isRequire
            ? (<Tag color="green">必须</Tag>)
            : (<Tag color="blue">非必须</Tag>)
        }
      </span>
    )
  }

  renderEnumTable = (record) => {
    if (!record.enum) return null
    const parentUid = record.uid
    const columns = [
      {
        title: '枚举key',
        dataIndex: 'value',
        key: 'value',
        render: (text, record) => this.renderEnumColumns(parentUid, record, 'value')
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type'
      },
      {
        title: '描述',
        dataIndex: 'desc',
        key: 'desc',
        render: (text, record) => this.renderEnumColumns(parentUid, record, 'desc')
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => (
          this.props.isEditor
            ? (
              <span className="table-operation">
                <a href="javascript:void(0)" onClick={() => this.props.trackDetailStore.deletEnumList(parentUid, record.uid)}>Delete</a>
              </span>
            ) : (<span>空</span>)
        )
      }
    ]
    return (
      <Table
        columns={columns}
        dataSource={record.enum}
        pagination={false}
        rowKey="uid"
      />
    )
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 }
    }

    const columns = [{
      title: '字段',
      dataIndex: 'propName',
      key: 'propName',
      render: (text, record) => this.renderInputColumns(text, record, 'propName')
    }, {
      title: '类型',
      dataIndex: 'propType',
      key: 'propType',
      render: (text, record) => this.renderSelectColumns(text, record, 'propType')
    }, {
      title: '是否必须',
      dataIndex: 'isRequire',
      key: 'isRequire',
      render: (text, record) => this.renderSwitchColumns(text, record, 'isRequire')
    }, {
      title: '描述',
      dataIndex: 'desc',
      key: 'desc',
      render: (text, record) => this.renderInputColumns(text, record, 'desc')
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        this.props.isEditor
          ? (
            <span className="table-operation">
              <a href="javascript:void(0)" onClick={() => { this.handleRemoveProp(record.uid) }}>Delete</a>
              { record.propType === 'enum' ? <span className="ant-divider" /> : null }
              { record.propType === 'enum' ? <a href="javascript:void(0)" onClick={() => { this.handleAddEnumList(record.uid) }}>Add Enum</a> : null}
            </span>
          ) : (<span>空</span>)
      )
    }]

    return (
      <div>
        <Row>
          <Col span={24}>
            <Card title="基础信息设置" bordered noHovering={false}>
              <Form layout="horizontal">
                <FormItem
                  label="埋点平台"
                  {...formItemLayout}
                >
                  {getFieldDecorator('channel', { initialValue: '1' })(
                    <Radio.Group onChange={this.handleFormLayoutChange}>
                      <Radio.Button value="1">Mobile</Radio.Button>
                      <Radio.Button value="2">PC</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>
                <FormItem
                  label="埋点KEY"
                  {...formItemLayout}
                >
                  {getFieldDecorator('eventkey', {
                    rules: [{ required: true, message: '请填写 eventKey!' }]
                  })(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
                <FormItem
                  label="埋点Category"
                  {...formItemLayout}
                >
                  {getFieldDecorator('eventcategory', {
                    rules: [{ required: true, message: '请填写 eventCategory!' }]
                  })(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
                <FormItem
                  label="描述内容"
                  {...formItemLayout}
                >
                  {getFieldDecorator('desc', {
                    rules: [{ required: true, message: '描述一下这个埋点吧！' }]
                  })(
                    <TextArea rows={5} placeholder="请输入" />
                  )}
                </FormItem>
                <FormItem
                  label="版本号"
                  {...formItemLayout}
                >
                  <Popover content={<span style={{ color: '#999' }}>新建埋点默认版本为 v1</span>} trigger="hover">
                    <Tag color="blue">v1</Tag>
                  </Popover>
                </FormItem>
              </Form>
            </Card>
          </Col>
        </Row>
        <Row style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card title="埋点数据设置" bordered noHovering={false}>
              <Row gutter={80}>
                <Col span={2}>
                  <Button type="primary" icon="plus" onClick={this.handleAddProp}>属性</Button>
                </Col>
                <Col span={2}>
                  <Button type="primary" icon="file-text" onClick={this.props.trackDetailStore.setEditorStatue}>{this.props.isEditor ? '退出编辑' : '进入编辑'}</Button>
                </Col>
              </Row>
              <Table
                style={{ marginTop: 8 }}
                columns={columns}
                dataSource={this.props.pointProps}
                pagination={false}
                rowKey="uid"
                expandedRowRender={this.renderEnumTable}
                defaultExpandAllRows
              />
            </Card>
          </Col>
        </Row>
        <Row style={{ marginTop: 24 }}>
          <Col span={24} style={{ textAlign: 'right' }}>
            { this.isNew ? null : <Button type="primary" size="large" icon="delete" onClick={this.handlerSubmitPoint}>删除</Button> }
            { this.isNew ? null : <Button type="primary" size="large" icon="edit" style={{ marginLeft: 8 }} onClick={this.handlerSubmitPoint}>更新</Button> }
            <Button type="primary" size="large" icon="to-top" style={{ marginLeft: 8 }} onClick={this.handlerSubmitPoint}>{this.isNew ? '新建埋点' : '创建新版本'}</Button>
          </Col>
        </Row>
      </div>
    )
  }
}

export default inject(stores => ({
  pointProps: stores.trackDetailStore.pointProps.slice(),
  trackDetailStore: stores.trackDetailStore,
  isEditor: stores.trackDetailStore.isEditor,
  setEditorStatue: stores.trackDetailStore.setEditorStatue
}))(
  observer(Form.create()(PointTrackDetailView))
)
