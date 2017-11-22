import Login from './login'
import Portal from './portal'
import BatchList from './batchList'
import BatchDetail from './batchDetail'
import TrackDetail from './trackDetail'
import TrackList from './trackList'

class RootStore {
  constructor () {
    this.stores = {
      loginStore: new Login(this),
      portalStore: new Portal(this),
      batchListStore: new BatchList(this),
      batchDetailStore: new BatchDetail(this),
      trackDetailStore: new TrackDetail(this),
      trackList: new TrackList(this)
    }
  }
}

export default new RootStore()
