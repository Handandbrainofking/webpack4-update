
import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import TrackOrder from '@/page/track/trackOrder.vue'
import OrderProgress from '@/page/track/components/orderProgress.vue'
import userInfo from '@mock/http/userinfo'
import { sync } from 'realpath-native';
import TaskStoreExp from '@/store/task'

const localVue = createLocalVue()
localVue.use(Vuex)
const store = new Vuex.Store(TaskStoreExp.start())
describe('trackOrder 订单详情测试', () => {
  let wrapper = null
  const GetMatterList = 'bpmsx/order/matter/v1/getMatterList'
  const GetMatterListParams = {
    applyNo: 'ZZS0420190107011'
  }

  beforeAll(() => {
    store.commit('setLoginData', userInfo)

   })

  beforeEach(() => {
    function judgeNodeFromTraceItem(item, nodeType) {
      return item.matterKey === nodeType && item.isHandled === '0' && item.deleteFlag === '0'
    }

  })


  it('下户点击事件',async () => {
    // await wrapper.update()
    // const TrackOrderWrapper = wrapper.find(TrackOrder)

  })

})
