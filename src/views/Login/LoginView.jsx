import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import { Redirect } from 'react-router-dom'
import { message } from 'antd'

import LoginForm from './components/LoginForm'
import './LoginView.scss'

@inject(stores => ({ loginStore: stores.loginStore }))
@observer
export default class LoginView extends Component {
  static propTypes = {
    loginStore: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.props.loginStore.verifyToken()
  }

  handleSubmit = (values) => {
    this.props.loginStore.signIn(values).then(err => {
      if (err) { message.error('邮箱或密码错误，请重试！') }
    })
  }

  render () {
    const { logged } = this.props.loginStore
    return logged ? (
      <Redirect to={{ pathname: '/home/batch' }} />
    ) : (
      <div className="login-wrapper">
        <div className="login-form-block">
          <LoginForm handleSubmit={this.handleSubmit} />
        </div>
      </div>
    )
  }
}
