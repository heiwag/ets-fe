import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon, Select } from 'antd'

const Option = Select.Option

export default class EditableCell extends Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    allUser: PropTypes.array
  }

  static defaultProps = {
    allUser: []
  }

  constructor (props) {
    super(props)
    this.state = {
      editable: false,
      value: this.props.value
    }
  }

  handlerCheck = value => {
    this.setState({
      editable: false,
      value
    })
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  handlerEdit = () => {
    this.setState({ editable: true })
  }

  renderUserSelect = () => {
    const allUser = this.props.allUser.slice()
    return allUser.map(user => (
      <Option key={user.id} value={user.id}>{user.name}</Option>
    ))
  }

  renderEditor = value => {
    return (
      <div className="editable-cell-input-wrapper">
        <Select
          showSearch
          style={{ width: 70 }}
          placeholder="选择负责人"
          optionFilterProp="children"
          onChange={this.handlerCheck}
          defaultValue={value}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {this.renderUserSelect()}
        </Select>
        <Icon
          style={{ cursor: 'pointer' }}
          type="check"
          className="editable-cell-icon-check"
          onClick={this.handlerCheck}
        />
      </div>
    )
  }

  renderText = value => {
    const user = this.props.allUser
      .slice()
      .filter(user => user.id === value)
      .shift() || {}

    return (
      <div className="editable-cell-text-wrapper">
        {user.name || ' '}
        <Icon
          style={{ cursor: 'pointer' }}
          type="edit"
          className="editable-cell-icon"
          onClick={this.handlerEdit}
        />
      </div>
    )
  }

  render () {
    const { editable, value } = this.state
    return (
      <div className="editable-cell">
        {
          editable
            ? this.renderEditor(value)
            : this.renderText(value)
        }
      </div>
    )
  }
}
