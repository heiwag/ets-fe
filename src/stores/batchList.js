import { observable, action, runInAction } from 'mobx'
import axios from 'axios'
import domain from '../utils/domain'

class BatchList {
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
      `${domain.apiDomain}/batch/batchList`,
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
}

export default BatchList
