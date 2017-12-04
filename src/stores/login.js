import { observable, action, runInAction, autorun } from 'mobx'
import axios from 'axios'
import domain from '../utils/domain'

class Login {
  @observable username = { value: '' }
  @observable password = { value: '' }
  @observable remember = { value: true }
  @observable logged = false
  @observable token = null
  @observable userInfo = {}

  constructor (rootStore) {
    this.rootStroe = rootStore
    this.token = localStorage.getItem('t')
    this.verifyToken()
    autorun(() => {
      const token = this.token
      localStorage.setItem('t', token)
    })
  }

  @action
  setField = (filds) => {
    Object.keys(filds).forEach(fild => {
      this[fild] = filds[fild]
    })
  }

  @action
  async signIn (values) {
    try {
      const res = await axios({
        url: `${domain.apiDomain}/login`,
        method: 'post',
        data: values
      })
      if (!res.data.err) {
        values.remember
          ? localStorage.setItem('t', res.headers.authorization)
          : localStorage.removeItem('t')
        runInAction(() => {
          this.logged = true
          this.token = res.headers.authorization
          this.userInfo = res.data
        })
      } else {
        return { err: 'user not found' }
      }
    } catch (ex) {
      console.error(ex)
      return { err: ex }
    }
  }

  @action
  async verifyToken () {
    const token = localStorage.getItem('t')
    if (!token || token === 'null') return false
    try {
      const res = await axios.post(
        `${domain.apiDomain}/login/verify`,
        null,
        { headers: { Authorization: token } }
      )
      if (!res.data.err) {
        runInAction(() => {
          this.logged = true
          this.token = res.headers.authorization
          this.userInfo = res.data
        })
      }
    } catch (ex) {
      console.error(ex)
    }
  }
}

export default Login
