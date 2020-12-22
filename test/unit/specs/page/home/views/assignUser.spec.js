/* global delay, nextTick  */
import { shallowMount } from "@vue/test-utils";
import Component from "@test/utils/Component";
import assignUserDoc from "@/page/home/views/assign-doc.vue";
import userInfo from "@mock/http/userinfo";

/**
 * 1. 测试HTTP参数、方法是否满足
 * 2. 测试数据返回时状态的更新
 * 3. 刷新时状态更新是否正常
 */
describe("组内人员列表接口测试", () => {
  let comp = null;
  const $store = window.$store;
  const urlGrouplist = "/bpmsx/order/matter/v1/getGroupMemberWaitingTaskList";
  const urlOperateList = "/bpmsx/order/handle/v1/geOperateUserList";

  const getOperateParams = {
    applyNo: "",
    matterKey: "TrustAccount"
  };
  const groupListParams = {
    appointSearchTime: "",
    beforeSend: 1,
    companyCode: "755121",
    orderBy: "appointTime",
    orderType: "asc",
    pageNumber: 1,
    pageSize: 14,
    type: 0,
    matterKey: "TrustAccount",
    queryKeyword:'',
    userIds: ["20000027752562","10000058902191","70000000061240","70000000061160","70000000170008","10000082530003","70000000061084","10000028027664","20000006888554","20000009517805","20000010534640","20000015156810"]
  };

  beforeAll(() => {
    $store.commit("setLoginData", userInfo);
  });

  beforeEach(() => {
    mockSuccess(
      "post",
      urlOperateList,
      getOperateParams,
      "bpmsx_order_appoint_v1_operateUserList"
    );
    mockSuccess(
      "post",
      urlGrouplist,
      groupListParams,
      "bpmsx_order_matter_v1_grouplist"
    );
    comp = new Component(
      shallowMount(assignUserDoc, {
        attrs: { matterKey: "TrustAccount" }
      })
    );
  });

  it("请求组内人员名单", async () => {
    await delay(1000);
    expect(comp.vm.rawUserData.length).toBe(12);
    expect(comp.vm.assignList.length).toBe(20);
    expect(comp.vm.total).toBe(889);
    expect(comp.vm.pageNumber).toBe(1);
    expect(comp.vm.pageCount).toBe(45);
    expect(comp.vm.pageSize).toBe(14);
  });

  it("根据姓名搜索组内人员", async () => {
    await nextTick();
    groupListParams.queryKeyword = '白文优'
    mockSuccess(
      "post",
      urlGrouplist,
      groupListParams,
      "bpmsx_order_matter_v1_grouplist"
    );
    await delay(1000);
    expect(comp.vm.assignList.length).toBe(20);
  });
});
