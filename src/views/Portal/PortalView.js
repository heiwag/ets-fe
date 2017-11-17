import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { renderRoutes } from 'react-router-config'
// import { NavLink as Link } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { Layout, Menu, Icon } from 'antd'

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

@inject(stores => ({ portalStore: stores.portalStore }))
@observer
export default class PortalView extends Component {
  static propTypes = {
    route: PropTypes.object,
    portalStore: PropTypes.object,
    history: PropTypes.object
  }

  menuItemClick = ({ key }) => {
    const pathname = routerMap[key] || '/batch'
    this.props.history.push({ pathname })
  }

  render () {
    const { collapsed, toggle, selectKey } = this.props.portalStore
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
            <Icon
              className="trigger"
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={toggle}
            />
          </Header>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
            {renderRoutes(this.props.route.routes)}
          </Content>
        </Layout>
      </Layout>
    )
  }
}
