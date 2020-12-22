/* global delay, nextTick  */
import { shallowMount } from "@vue/test-utils";
import Component from "@test/utils/Component";
import transferDoc from "@/components/dialog/transfer-order.vue";
import userInfo from "@mock/http/userinfo";

/**
 * 1. 测试HTTP参数、方法是否满足
 * 2. 测试数据返回时状态的更新
 * 3. 刷新时状态更新是否正常
 */
describe("赎楼失败锁定跟单人", () => {
  let comp = null;
  const $store = window.$store;
  const urltransferOrder = "/bpmsx/order/handle/v1/transferOrder";

  const transferOrderParams = {
    applyNo: " ZZS0220190221008",
    appointTime: "2019-04-03 08:54",
    companyCode: "371121",
    matterKey: "RandomMark",
    matterName: "赎楼登记"
  };

  beforeAll(() => {
    $store.commit("setLoginData", userInfo);
  });

  beforeEach(() => {
    comp = new Component(shallowMount(transferDoc));
  });

  it("触发转单判断赎楼失败锁定待办无法转单", async () => {
    comp.wrapper.setData(
      {
        orderInfo: {
          applyNo: " ZZS0220190221008",
          appointTime: "2019-04-03 08:54",
          matterKey: "RandomMark",
          matterName: "赎楼登记"
        }
      }
    )
    comp.vm.doCommit();
    mockSuccess(
      "post",
      urltransferOrder,
      transferOrderParams,
      "bpmsx_order_handle_v1_transferOrder"
    )
  });
});
