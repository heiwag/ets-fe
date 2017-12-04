import { observable, action } from 'mobx'

class Portal {
  @observable collapsed
  @observable selectKey

  constructor (rootStore) {
    this.rootStore = rootStore
    this.collapsed = false
  }

  @action toggle = () => {
    this.collapsed = !this.collapsed
  }

  @action setSelectKey (key) {
    this.selectKey = key
  }

  @action logout () {
    localStorage.removeItem('t')
    window.location.assign(location.origin)
  }
}

export default Portal
