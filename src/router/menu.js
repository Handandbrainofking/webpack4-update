import * as RouterDefined from './defined'
import MainPage from '../page/main.vue'
import LoginPage from '../page/login/dd_login.vue'
import HomePage from '../page/home/home.vue'
import OrderList from '../page/order/order-list.vue'
import DataListPage from '../page/data/data-list.vue'
// 要件管理
import ImportDocListPage from '../page/important-doc/important-doc-list.vue'
import PerformanceList from '../page/performance/performance-list.vue'
import CalendarPage from '../page/calendar/calendar.vue'
import WeekCalendarPage from '../page/calendar/weekCalendar.vue'
import TodoInfoPage from '../page/calendar/todoInfo.vue'
import UserInfoPage from '../page/setting/setting_info.vue'
// 消息部分
import MessageDetail from '../page/message/message-detail.vue'
import MessageListPage from '../page/message/message-list.vue'
// 追踪订单
import TrackOrder from '../page/track/trackOrder.vue'
// 特指订单
import SpecialApproval from '../page/special-approval/SpecialApproval.vue'

const RouterList = [
  {
    path: RouterDefined.Root,
    redirect: RouterDefined.Login,
    component: MainPage,
    meta: {
      requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
    },
    children: [
      {
        path: RouterDefined.Home,
        component: HomePage,
        meta: {
          requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        }
      },
      {
        path: RouterDefined.DataList,
        component: DataListPage,
        meta: {
          requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        }
      },
      {
        path: RouterDefined.CalendarPage,
        component: CalendarPage,
        meta: {
          requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        }
      },
      {
        path: RouterDefined.WeekCalendarPage,
        component: WeekCalendarPage,
        meta: {
          requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        }
      },
      {
        path: RouterDefined.ImportDocListPage,
        component: ImportDocListPage,
        meta: {
          requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        }
      },
      {
        path: RouterDefined.PerformanceList,
        component: PerformanceList,
        meta: {
          requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        }
      },
      {
        path: RouterDefined.TodoInfo,
        component: TodoInfoPage,
        meta: {
          requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        }
      },
      {
        path: RouterDefined.OrderList,
        component: OrderList,
        meta: {
          requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        }
      },
      {
        path: RouterDefined.TrackOrder,
        component: TrackOrder,
        meta: {
          requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        }
      },
      {
        path: RouterDefined.MessageList,
        component: MessageListPage,
        meta: {
          requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        }
      },
      {
        path: RouterDefined.UserInfo,
        component: UserInfoPage,
        meta: {
          requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        }
      },
      {
        path: RouterDefined.MessageDetail,
        component: MessageDetail,
        meta: {
          requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        }
      },
      {
        path: RouterDefined.SpecialApproval,
        component: SpecialApproval,
        meta: {
          requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
        }
      }
    ]
  },
  {
    path: RouterDefined.Login,
    component: LoginPage
  }
]

export default RouterList
