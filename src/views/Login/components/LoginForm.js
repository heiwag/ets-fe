import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'

import { Form, Icon, Input, Button, Checkbox } from 'antd'
import './LoginForm.scss'

const FormItem = Form.Item

class LoginForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    handleSubmit: PropTypes.func
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.handleSubmit(values)
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入正确的邮箱!' }]
          })(
            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="邮箱" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入正确的密码!' }]
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked'
          })(
            <Checkbox>记住我</Checkbox>
          )}
          <a className="login-form-forgot" href="mailto:zhiqiang@guanghe.tv?Subject=埋点系统忘记密码" target="_top">忘记密码</a>
          <Button type="primary" htmlType="submit" className="login-form-button">
            登录
          </Button>
        </FormItem>
      </Form>
    )
  }
}

export default inject(stores => ({ loginStore: stores.loginStore }))(observer(Form.create({
  onFieldsChange (props, fields) {
    props.loginStore.setField(fields)
  },
  mapPropsToFields (props) {
    const { username, password, remember } = props.loginStore
    return { username, password, remember }
  }
})(LoginForm)))
