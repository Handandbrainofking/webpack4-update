/* global delay, nextTick  */
import { shallowMount } from "@vue/test-utils"; // TODO:LCL(0327) 代码格式异常
import Component from "@test/utils/Component";
import applyInfo from "@/page/track/components/applyInfo.vue";
import userInfo from "@mock/http/userinfo";

/**
 * 1. 测试HTTP参数、方法是否满足
 * 2. 测试数据返回时状态的更新
 * 3. 刷新时状态更新是否正常
 */
describe("订单信息", () => {
  let comp = null;
  const $store = window.$store;
  const urlgetCheckOpinionList = "/bpmsx/order/matter/v1/checkOpinionList/get";
  const urlgetOrderBaseInfo = "/bpmsx/order/info/v1/getOrderBaseInfo";
  const urlgetProductInfo = "/bpmsx/order/relates/v1/getProductInfo";
  const urlgetKeyMessage="/bpmsx/order/info/v1/getKeyMessage"
  const urlgetOrderInfo = "/bpmsx/order/info/v1/getOrderModuleInfo";

  const getCheckOpinionListParams = {
    applyNo: "ZZS0120190103017"
  };
  const getOrderInfoParams = {
    applyNo: "ZZS0120190103017",
    relationKey: "insurancePolicyList"
  };

  beforeAll(() => {
    $store.commit("setLoginData", userInfo);
  });

  beforeEach(() => {
    mockSuccess(
      "get",
      urlgetCheckOpinionList,
      getCheckOpinionListParams,
      "bpmsx_order_matter_v1_checkOpinionList_get"
    );
    mockSuccess(
      "get",
      urlgetOrderBaseInfo,
      getCheckOpinionListParams,
      "bpmsx_order_info_v1_getOrderBaseInfo"
    );
    mockSuccess(
        "post",
        urlgetProductInfo,
        getCheckOpinionListParams,
        "bpmsx_order_relates_v1_getProductInfo"
    )
    mockSuccess(
        "post",
        urlgetKeyMessage,
        getCheckOpinionListParams,
        "bpmsx_order_info_v1_getKeyMessage"
    )
    mockSuccess(
      "post",
      urlgetOrderInfo,
      getOrderInfoParams,
      "bpmsx_order_info_v1_getInsurancePolicyList"
    );
    comp = new Component(
      shallowMount(applyInfo, {
        propsData: { applyNo: "ZZS0120190103017" }
      })
    );
  });

  it("订单信息保险类产品增加保单信息", async () => {
    await delay(1000);
    comp.wrapper.setData({
      applyInfo: {
        productId: "JYB_YSL_YJY_ISR"
      }
    });

    expect(comp.vm.showInsureInfo).toBe(true); // TODO:LCL(0327) 单元测试作为一个白盒测试，更关注于代码功能的实现而不是界面的渲染效果
    expect(comp.vm.insurancePolicyList.length).toBe(1);
    expect(comp.html).toMatch(/label="保单名称"/);
    expect(comp.html).toMatch(/content="房屋抵押履约保障"/);
    expect(comp.html).toMatch(/label="保单号"/);
    expect(comp.html).toMatch(/content="ZZS0120190103017"/);
    expect(comp.html).toMatch(/label="保险金额"/);
    expect(comp.html).toMatch(/content="750,000.00"/);
    expect(comp.html).toMatch(/label="保费"/);
    expect(comp.html).toMatch(/content="1,125.00"/);
    expect(comp.html).toMatch(/label="保单开始日期"/);
    expect(comp.html).toMatch(/content="2019-02-20"/);
    expect(comp.html).toMatch(/label="保单终止日期"/);
    expect(comp.html).toMatch(/content="2019-08-18"/);
    expect(comp.html).toMatch(/label="保险费率"/);
    expect(comp.html).toMatch(/content="0.6"/);
  });
});
