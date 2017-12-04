import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { renderRoutes } from 'react-router-config'
import { inject, observer } from 'mobx-react'
import _ from 'lodash'
import {
  Layout, Menu, Icon, Avatar, Row,
  Col, Dropdown
} from 'antd'

import './PortalView.scss'

const imgs = {
  logoImg: require('../../assets/logo-img.png'),
  logoText: require('../../assets/logo-text.png')
}

const routerMap = {
  batch: '/home/batch',
  'point-track': '/home/point-track',
  'point-test': '/home/point-test',
  prd: '/home/prd'
}

const { Header, Sider, Content } = Layout

@inject(stores => ({ portalStore: stores.portalStore, userInfo: stores.loginStore.userInfo }))
@observer
export default class PortalView extends Component {
  static propTypes = {
    route: PropTypes.object,
    portalStore: PropTypes.object,
    userInfo: PropTypes.object,
    history: PropTypes.object
  }

  menuItemClick = ({ key }) => {
    const pathname = routerMap[key] || '/batch'
    this.props.history.push({ pathname })
  }

  handlerExit = () => {
    this.props.portalStore.logout()
  }

  render () {
    const { collapsed, toggle, selectKey } = this.props.portalStore
    const userDropMenu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="https://shimo.im/doc/bNZH45Kcdage2Wte?r=4M12JY//">需求反馈</a>
        </Menu.Item>
        <Menu.Item>
          <a rel="noopener noreferrer" href="javascript:void(0)" onClick={this.handlerExit}>退出登录</a>
        </Menu.Item>
      </Menu>
    )
    return (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
        >
          <div className="logo">
            <img className="logo-img" src={imgs.logoImg} alt="logo" />
            { collapsed ? null : <img className="logo-text" src={imgs.logoText} alt="logo-title" /> }
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[selectKey]}
            onClick={this.menuItemClick}
          >
            <Menu.Item key="batch">
              <Icon type="bars" />
              <span>埋点批次</span>
            </Menu.Item>
            <Menu.Item key="point-track">
              <Icon type="api" />
              <span>埋点管理</span>
            </Menu.Item>
            <Menu.Item key="point-test">
              <Icon type="code" />
              <span>埋点测试</span>
            </Menu.Item>
            <Menu.Item key="prd">
              <Icon type="file-ppt" />
              <span>PRD管理</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Row>
              <Col span={8}>
                <Icon
                  className="trigger"
                  type={collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={toggle}
                />
              </Col>
              <Col span={8} offset={8} className="user-avatar">
                <Row>
                  <Col span={12} offset={12}>
                    <Avatar style={{ backgroundColor: '#87d068', verticalAlign: 'middle' }} icon="user" />
                    <Dropdown overlay={userDropMenu}>
                      <span style={{ paddingLeft: '10px', cursor: 'pointer' }}>{_.get(this.props.userInfo, 'name', '')}</span>
                    </Dropdown>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Header>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
            {renderRoutes(this.props.route.routes)}
          </Content>
        </Layout>
      </Layout>
    )
  }
}
