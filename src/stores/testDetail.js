import { observable, action, runInAction } from 'mobx'
import axios from 'axios'
import domain from '../utils/domain'

class TestDetail {
  @observable tableData = []
  @observable totalCount = 0
  @observable pageSize = 10
  @observable loading = true

  constructor (rootStore) {
    this.rootStore = rootStore
  }

  @action
  async getTableData (query) {
    this.loading = true
    const token = this.rootStore.stores.loginStore.token
    query.pageSize = this.pageSize
    const res = await axios.post(
      `${domain.apiDomain}/pointTest/testDetail`,
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
  async deleteEvent (pointId, deviceType) {
    const token = this.rootStore.stores.loginStore.token
    const res = await axios.post(
      `${domain.apiDomain}/pointTest/deleteDetail`,
      { point_id: pointId, device_type: deviceType },
      { headers: { Authorization: token } }
    )
    return !res.data
  }

  @action async deleteOne (eventId) {
    const token = this.rootStore.stores.loginStore.token
    const res = await axios.post(
      `${domain.apiDomain}/pointTest/deleteOneDetail`,
      { eventId },
      { headers: { Authorization: token } }
    )
    return !res.data
  }

  @action async keepNumber (pointId, channel, keepCount) {
    const token = this.rootStore.stores.loginStore.token
    const res = await axios.post(
      `${domain.apiDomain}/pointTest/deleteOutFirst`,
      { pointId, channel, keepCount },
      { headers: { Authorization: token } }
    )
    return !res.data
  }
}

export default TestDetail
