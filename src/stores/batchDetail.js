import { observable, action, runInAction } from 'mobx'
import axios from 'axios'
import domain from '../utils/domain'

class BatchDetail {
  @observable formData = {}
  @observable loading = false

  constructor (rootStore) {
    this.rootStore = rootStore
  }

  @action
  resetForm () {
    this.formData = {
      name: '',
      desc: '',
      channel: '1',
      createtime: '',
      frozetime: '',
      status: 0
    }
  }

  @action
  async fetchBatchDetail (batchId) {
    this.loading = true
    const token = this.rootStore.stores.loginStore.token
    const res = await axios.get(
      `${domain.apiDomain}/batch/detail?batchId=${batchId}`,
      { headers: { Authorization: token } }
    )

    runInAction(() => {
      this.formData = res.data
      this.loading = false
    })

    return !res.data.err
  }

  @action
  async updateBatch (formData) {
    const token = this.rootStore.stores.loginStore.token
    const res = await axios.post(
      `${domain.apiDomain}/batch/update`,
      formData,
      { headers: { Authorization: token } }
    )

    return !res.data.err
  }

  @action
  async deleteBatch (batchId) {
    const token = this.rootStore.stores.loginStore.token
    const res = await axios.post(
      `${domain.apiDomain}/batch/delete`,
      { batchId },
      { headers: { Authorization: token } }
    )

    return !res.data.err
  }

  @action
  async completeBatch (batchId) {
    const token = this.rootStore.stores.loginStore.token
    const res = await axios.post(
      `${domain.apiDomain}/batch/complete`,
      { batchId },
      { headers: { Authorization: token } }
    )

    return !res.data.err
  }

  @action
  async addNewBatch (model) {
    const token = this.rootStore.stores.loginStore.token
    const res = await axios.post(
      `${domain.apiDomain}/batch/addNewBatch`,
      model,
      { headers: { Authorization: token } }
    )
    return !res.data.err
  }
}

export default BatchDetail
