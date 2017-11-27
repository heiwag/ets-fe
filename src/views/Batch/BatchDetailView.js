import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import moment from 'moment'
import {
  Form, Card, Col, Row, Input,
  Radio, Tag, Spin, Button, message
} from 'antd'

const FormItem = Form.Item
const { TextArea } = Input
// const Option = Select.Option
// const confirm = Modal.confirm

const channelTable = {
  1: 'Mobile',
  2: 'PC',
  3: 'H5'
}

class BatchDetailView extends Component {
  static propTypes = {
    match: PropTypes.object,
    loading: PropTypes.bool,
    form: PropTypes.object,
    formData: PropTypes.object,
    batchDetailStore: PropTypes.object,
    history: PropTypes.object
  }

  constructor (props) {
    super(props)
    const { action, batchId } = this.props.match.params
    this.action = action
    this.isNew = action === 'new'
    this.batchId = batchId

    if (!this.isNew) {
      this.props.batchDetailStore.fetchBatchDetail(this.batchId)
    } else {
      this.props.batchDetailStore.resetForm()
    }
  }

  /**
   * 删除批次
   */
  handlerDeleteBatch = () => {
    this.props.batchDetailStore.deleteBatch(this.batchId)
      .then(res => {
        message.success('删除成功!', 2, () => {
          this.props.history.replace({ pathname: '/home/batch' })
        })
      })
      .catch(err => {
        message.error(err.response.data.msg, 3)
      })
  }

  /**
   * 添加新批次
   */
  handlerAddNewBatch = () => {
    this.props.form.validateFieldsAndScroll((err) => {
      if (err) return
      const formData = this.props.form.getFieldsValue()
      this.props.batchDetailStore.addNewBatch(formData)
        .then(res => {
          message.success('新增成功!', 2, () => {
            this.props.history.replace({ pathname: '/home/batch' })
          })
        })
        .catch(err => {
          message.error(err.response.data.msg, 3)
        })
    })
  }

  /**
   * 更新批次数据
   */
  handlerUpdateBatch = () => {
    this.props.form.validateFieldsAndScroll((err) => {
      if (err) return
      let formData = this.props.form.getFieldsValue()
      formData.batchid = this.batchId
      this.props.batchDetailStore.updateBatch(formData)
        .then(res => {
          message.success('更新成功!', 2, () => {
            this.props.history.replace({ pathname: '/home/batch' })
          })
        })
        .catch(err => {
          message.error(err.response.data.msg, 3)
        })
    })
  }

  /**
   * 完成批次
   */
  handlerCompleteBatch = () => {
    this.props.batchDetailStore.completeBatch(this.batchId)
      .then(res => {
        message.success('批次完成', 2, () => {
          this.props.history.replace({ pathname: '/home/batch' })
        })
      })
      .catch(err => {
        message.error(err.response.data.msg, 3)
      })
  }

  renderActionButton () {
    const isNew = this.isNew
    if (!isNew && this.props.formData.status === 1) {
      // 以完成的批次不允许任何操作
      return null
    }
    if (isNew) {
      return (
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            size="large"
            icon="to-top"
            style={{ marginLeft: 8 }}
            onClick={this.handlerAddNewBatch}
          >新建批次</Button>
        </Col>
      )
    } else {
      return (
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            size="large"
            icon="delete"
            onClick={this.handlerDeleteBatch}
          >删除</Button>
          <Button
            type="primary"
            size="large"
            icon="edit"
            style={{ marginLeft: 8 }}
            onClick={this.handlerUpdateBatch}
          >更新</Button>
          <Button
            type="primary"
            size="large"
            icon="to-top"
            style={{ marginLeft: 8 }}
            onClick={this.handlerCompleteBatch}
          >完成这个批次</Button>
        </Col>
      )
    }
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const isNew = this.isNew
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 }
    }
    const {
      channel = '1',
      name,
      desc,
      createtime,
      frozetime,
      status = 0
    } = this.props.formData

    return (
      <div>
        <Spin spinning={this.props.loading}>
          <Row>
            <Col span={24}>
              <Card title={this.isNew ? '创建批次' : '批次详情'} bordered noHovering>
                <Row gutter={80}>
                  <Form layout="horizontal">
                    <FormItem
                      label="批次平台"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('channel', { initialValue: channel.toString() })(
                        isNew ? (
                          <Radio.Group>
                            <Radio.Button value="1">Mobile</Radio.Button>
                            <Radio.Button value="2">PC</Radio.Button>
                            <Radio.Button value="3">H5</Radio.Button>
                          </Radio.Group>
                        ) : <span>{channelTable[channel.toString()]}</span>
                      )}
                    </FormItem>
                    <FormItem
                      label="批次名称"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('name', {
                        initialValue: name,
                        rules: [{ required: true, message: '请填写批次名称' }]
                      })(
                        status === 0 ? <Input placeholder="请输入" /> : <span>{name}</span>
                      )}
                    </FormItem>
                    {isNew ? null : <FormItem
                      label="批次状态"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('status', {
                        initialValue: status
                      })(
                        status === 0 ? <Tag color="blue">未完成</Tag> : <Tag color="green">已完成</Tag>
                      )}
                    </FormItem>}
                    {isNew ? null : <FormItem
                      label="创建时间"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('createtime', { initialValue: createtime })(
                        <span>{createtime && moment(createtime).format('YYYY-MM-DD H:mm')}</span>
                      )}
                    </FormItem>}
                    {isNew ? null : <FormItem
                      label="完成时间"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('forzetime', { initialValue: frozetime })(
                        <span>{(frozetime && moment(frozetime).format('YYYY-MM-DD H:mm')) || '-'}</span>
                      )}
                    </FormItem>}
                    <FormItem
                      label="描述内容"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('desc', {
                        initialValue: desc,
                        rules: [{ required: true, message: '描述一下这个批次吧！' }]
                      })(
                        status === 0 ? <TextArea rows={5} placeholder="请输入" /> : <span>{desc}</span>
                      )}
                    </FormItem>
                  </Form>
                </Row>
              </Card>
            </Col>
          </Row>
          <Row style={{ marginTop: 24 }}>
            { this.renderActionButton() }
          </Row>
        </Spin>
      </div>
    )
  }
}

export default inject(stores => ({
  formData: stores.batchDetailStore.formData,
  loading: stores.batchDetailStore.loading,
  batchDetailStore: stores.batchDetailStore
}))(
  observer(Form.create()(BatchDetailView))
)
