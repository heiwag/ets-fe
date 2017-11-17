import { observable, action } from 'mobx'
import _ from 'lodash'
import { _uuid } from '../utils/uuid'
import axios from 'axios'
import domain from '../utils/domain'

class TrackDetail {
  @observable action = 'new'
  @observable pointId = 0
  @observable pointProps = []
  @observable isEditor = true

  constructor (rootStore) {
    this.rootStore = rootStore
    this.pointProps = []
  }

  @action
  setEditorStatue = () => {
    this.isEditor = !this.isEditor
  }

  @action
  setAction = (action) => {
    this.action = action
  }

  @action
  setPointId = (pointId) => {
    if (!pointId) return
    this.pointId = pointId
  }

  @action
  addProp = (prop) => {
    if (!prop) {
      this.pointProps.push({
        uid: _uuid(),
        propName: '',
        propType: 'String',
        isRequire: false,
        desc: ''
      })
    } else {
      this.pointProps.push(prop)
    }
  }

  @action
  removeProp = (uid) => {
    let propArray = this.pointProps.slice()
    _.remove(propArray, n => {
      return n.uid === uid
    })
    this.pointProps = propArray
  }

  @action
  setPropValue = (record, value, key) => {
    let propArray = this.pointProps.slice()
    const uid = record.uid
    const targetIndex = _.findIndex(propArray, x => x.uid === uid)
    if (key === 'propType' && value === 'enum') {
      _.set(propArray, [targetIndex, 'enum'], [{
        uid: _uuid(),
        value: '',
        type: 'String',
        desc: ''
      }])
    } else if (key === 'propType' && value !== 'enum') {
      _.set(propArray, [targetIndex, 'enum'], null)
    }
    _.set(propArray, [targetIndex, key], value)
    this.pointProps = propArray
  }

  @action
  setEnumPropValue = (parentUid, record, value, key) => {
    let propArray = this.pointProps.slice()
    const uid = record.uid
    const parentIndex = _.findIndex(propArray, x => x.uid === parentUid)
    if (_.isEmpty(propArray[parentIndex].enum)) return
    const enumIndex = _.findIndex(propArray[parentIndex].enum, x => x.uid === uid)
    _.set(propArray, [parentIndex, 'enum', enumIndex, key], value)
    this.pointProps = propArray
  }

  @action
  addEnumList = (uid) => {
    let propArray = this.pointProps.slice()
    const targetIndex = _.findIndex(propArray, x => x.uid === uid)
    _.update(propArray, [targetIndex, 'enum'], enums => {
      enums.push({
        uid: _uuid(),
        value: '',
        type: 'String',
        desc: ''
      })
      return enums.slice()
    })
    this.pointProps = propArray
  }

  @action
  deletEnumList = (parentUid, uid) => {
    let propArray = this.pointProps.slice()
    const parentIndex = _.findIndex(propArray, x => x.uid === parentUid)
    if (_.isEmpty(propArray[parentIndex].enum)) return
    _.remove(propArray[parentIndex].enum, x => x.uid === uid)
    this.pointProps = propArray
  }

  @action
  async submit (formData) {
    let newModel = formData
    const token = this.rootStore.stores.loginStore.token
    newModel.rawjsonschema = JSON.stringify(this.pointProps.slice())
    const req = await axios.post(
      `${domain.apiDomain}/pointPool/addNewPoint`,
      newModel,
      { headers: { Authorization: token } })
    if (!req.err) {
      return true
    } else {
      return false
    }
  }
}

export default TrackDetail
