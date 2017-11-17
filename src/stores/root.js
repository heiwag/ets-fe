import Login from './login'
import Portal from './portal'
import BatchList from './batchList'
import TrackDetail from './trackDetail'

class RootStore {
  constructor () {
    // this.loginStore = new Login(this)
    // this.portalStore = new Portal(this)
    // this.batchListStore = new BatchList(this)
    this.stores = {
      loginStore: new Login(this),
      portalStore: new Portal(this),
      batchListStore: new BatchList(this),
      trackDetailStore: new TrackDetail(this)
    }
  }
}

export default new RootStore()
