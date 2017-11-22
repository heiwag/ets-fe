import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import {
  Form, Card, Col, Row, Input,
  Radio, Tag, Spin
} from 'antd'

const FormItem = Form.Item
const { TextArea } = Input
// const Option = Select.Option
// const confirm = Modal.confirm

class BatchDetailView extends Component {
  static propTypes = {
    match: PropTypes.object,
    loading: PropTypes.bool,
    form: PropTypes.object,
    formData: PropTypes.object
  }

  constructor (props) {
    super(props)
    const { action, batchId } = this.props.match.params
    this.action = action
    this.isNew = action === 'new'
    this.batchId = batchId
  }
  render () {
    const { getFieldDecorator } = this.props.form
    // const isNew = this.isNew
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 }
    }

    const {
      channel = '1',
      // name,
      desc,
      createtime,
      forzetime
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
                        <Radio.Group>
                          <Radio.Button value="1">Mobile</Radio.Button>
                          <Radio.Button value="2">PC</Radio.Button>
                        </Radio.Group>
                      )}
                    </FormItem>
                    <FormItem
                      label="批次状态"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('status', { initialValue: status })(
                        <Tag color="blue">{status === 0 ? '未完成' : '已完成'}</Tag>
                      )}
                    </FormItem>
                    <FormItem
                      label="创建时间"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('createtime', { initialValue: createtime })(
                        <span>{createtime}</span>
                      )}
                    </FormItem>
                    <FormItem
                      label="完成时间"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('forzetime', { initialValue: forzetime })(
                        <span>{forzetime}</span>
                      )}
                    </FormItem>
                    <FormItem
                      label="描述内容"
                      {...formItemLayout}
                    >
                      {getFieldDecorator('desc', {
                        initialValue: desc,
                        rules: [{ required: true, message: '描述一下这个批次吧！' }]
                      })(
                        <TextArea rows={5} placeholder="请输入" />
                      )}
                    </FormItem>
                  </Form>
                </Row>
              </Card>
            </Col>
          </Row>
        </Spin>
      </div>
    )
  }
}

export default inject(stores => ({
  formData: {},
  loading: false
}))(
  observer(Form.create()(BatchDetailView))
)
