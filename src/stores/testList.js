import { observable, action, runInAction } from 'mobx'
import axios from 'axios'
import _ from 'lodash'
import domain from '../utils/domain'

class TestList {
  @observable tableData = []
  @observable testList = []
  @observable totalCount = 0
  @observable pageSize = 10
  @observable pageIndex = 1
  @observable loading = true
  @observable batchList = []
  @observable formData = {}
  @observable enumStatus = null
  @observable enumSuccess = false

  constructor (rootStore) {
    this.rootStore = rootStore
  }

  @action
  setField = (filds) => {
    Object.keys(filds).forEach(fild => {
      this.formData[fild] = filds[fild]
    })
  }

  @action
  setPageIndex = (pageIndex) => {
    this.pageIndex = pageIndex
  }

  @action
  async getTableData (query) {
    this.loading = true
    const token = this.rootStore.stores.loginStore.token
    query.pageSize = this.pageSize
    const res = await axios.post(
      `${domain.apiDomain}/pointTest/testList`,
      query,
      { headers: { Authorization: token } }
    )
    if (!res.data.err) {
      runInAction(() => {
        this.tableData = res.data.data
        this.totalCount = res.data.totalCount
        this.loading = false
      })
    } else {
      runInAction(() => {
        this.loading = false
      })
    }
  }

  @action
  async fetchBatchByChannelAndStatus (status = -1, channel = -1) {
    const token = this.rootStore.stores.loginStore.token
    const res = await axios.post(
      `${domain.apiDomain}/batch/fetchBatch`,
      { status, channel },
      { headers: { Authorization: token } }
    )

    runInAction(() => {
      this.batchList = res.data
    })

    return !res.data.err
  }

  @action
  async verifyEnum (pointId) {
    const token = this.rootStore.stores.loginStore.token
    const res = await axios.post(
      `${domain.apiDomain}/pointTest/verifyEnum`,
      { pointId },
      { headers: { Authorization: token } }
    )

    runInAction(() => {
      this.enumStatus = res.data.enumStatus
      this.enumSuccess = res.data.enumSuccess
    })

    return _.get(res, 'data.enumSuccess', false)
  }
}

export default TestList
