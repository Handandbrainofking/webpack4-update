/**
 * 订单操作
 */
import {http, formatDate} from '../common/utils'

 export default {
    state:{

    },
    actions:{
        transferOrder(store, {applyNo, user,matterKey, matterName,appointTime, appointAddress, remark}){
            return http.post('/bpmsx/order/handle/v1/transferOrder',{
              applyNo,
              transferUserId: user.id,
              transferUserName:user.fullname,
              transferUserRole: Array.prototype.map.call(user.roleList,r=>r.alias).join(','), //把角色拼成逗号分隔
              matterKey,
              matterName,
              appointAddress,
              remark,
              appointTime: typeof appointTime === 'number'? formatDate(appointTime, 'YYYY-MM-DD hh:mm'):appointTime
            });
        },
        getUndoMatters({rootGetters}, applyNo){
          return http.get('/bpmsx/order/matter/v1/getUndoMatters', {applyNo, companyCode: rootGetters.companyCode}); 
        },
        getAppointInfo(store, {applyNo, matterKey}){
          return http.post('/bpmsx/order/appoint/v1/get', {applyNo, matterKey});
        },
        getOrderInfo(store, applyNo){
          return http.get('/bpmsx/order/info/v1/getOrderBaseInfo', {applyNo});
        }
    },
   namespaced : true
 }