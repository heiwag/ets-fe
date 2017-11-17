import config from '../../config'
const isDev = process.env.NODE_ENV === 'development'

export default {
  apiDomain: isDev
    ? config.dev.apiDomain
    : config.build.apiDomain
}
