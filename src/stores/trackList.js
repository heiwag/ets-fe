import { observable, action, runInAction } from 'mobx'
import axios from 'axios'
import domain from '../utils/domain'

class TrackList {
  @observable tableData = []
  @observable totalCount = 0
  @observable pageSize = 10
  @observable pageIndex = 1
  @observable loading = true
  @observable batchList = []
  @observable allUser = []
  @observable selectedRowKeys = []
  @observable selectUserId = ''

  constructor (rootStore) {
    this.rootStore = rootStore
  }

  @action
  setPageIndex (pageIndex) {
    this.pageIndex = pageIndex
  }

  @action
  setPageSize (pageSize) {
    this.pageSize = pageSize
  }

  @action
  setSelectedRowKeys (selectedRowKeys) {
    this.selectedRowKeys = selectedRowKeys
  }

  @action
  setSelectUserId = selectUserId => {
    this.selectUserId = selectUserId
  }

  @action
  updateTableName (selectRowKeys, selectUserId) {
    this.tableData.forEach(point => {
      const hasChange = selectRowKeys.indexOf(point.pointid) > -1
      if (hasChange) {
        point.head_dev = selectUserId
      }
    })
    this.tableData = this.tableData.slice()
  }

  @action
  async fetTableList (query) {
    this.loading = true
    const token = this.rootStore.stores.loginStore.token
    query.pageSize = this.pageSize
    const res = await axios.post(
      `${domain.apiDomain}/pointPool/tableList`,
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
  async updatePointHeadDev (pointId, headDev) {
    const token = this.rootStore.stores.loginStore.token
    const res = await axios.post(
      `${domain.apiDomain}/pointPool/updatePointHeadName`,
      { pointId, headDev },
      { headers: { Authorization: token } }
    )
    return res.data.err
  }

  @action
  async getAllUser () {
    const token = this.rootStore.stores.loginStore.token
    const res = await axios.get(
      `${domain.apiDomain}/users/allUser`,
      { headers: { Authorization: token } }
    )

    if (res.data.err) {
      return res.data.err
    } else {
      runInAction(() => {
        this.allUser = res.data
      })
    }
  }
}

export default TrackList
