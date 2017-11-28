// import Loadable from 'react-loadable'
import PortalView from 'views/Portal/PortalView'
import LoginView from 'views/Login/LoginView'
import BatchView from 'views/Batch/BatchView'
import BatchDetailView from 'views/Batch/BatchDetailView'
import PointTrackView from 'views/PointTrack/PointTrackView'
import PointTrackDetailView from 'views/PointTrack/PointTrackDetailView'
import PointTestView from 'views/PointTest/PointTestView'
import PointTestDetail from 'views/PointTest/PointTestDetail'
import PrdView from 'views/Prd/PrdView'

// import SyncView from 'views/SyncView'
// import App from '../App'

// const AsyncView = Loadable({
//   loader: () => import('views/AsyncView'),
//   // if you have your own loading component,
//   // you should consider add it here
//   loading: () => null
// })

export default [
  { path: '/',
    component: LoginView,
    exact: true
  },
  { path: '/home',
    component: PortalView,
    routes: [
      { path: '/home/batch',
        component: BatchView,
        exact: true
      },
      { path: '/home/batch/:action/:batchId',
        component: BatchDetailView
      },
      { path: '/home/point-track',
        component: PointTrackView,
        exact: true
      },
      { path: '/home/point-track/:action/:pointId',
        component: PointTrackDetailView
      },
      { path: '/home/point-test',
        component: PointTestView,
        exact: true
      },
      { path: '/home/point-test/detail/:pointId/:deviceType',
        component: PointTestDetail
      },
      { path: '/home/prd',
        component: PrdView
      }
    ]
  }
]
