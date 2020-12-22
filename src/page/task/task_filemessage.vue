<!-- 引用生成list的组件实例 -->
<template>
	<div class="wrapper">
    <task-list :titleContent="titleContentBasic" 
               :fileMessage="fileMessageBasic"             
    ></task-list>
    <task-list :titleContent="titleContentForeclosure" 
               :fileMessage="fileMessageForeclosure"
               :shownote="shownote"
               :noteContent="noteContent"          
    ></task-list>
	</div>
</template>

<style scoped>
  .font{
    font-size:10px;
  }
  .color{
    color:#44CBB7;
  }

</style>

<script>
//引入列表生成组件
import TaskList from './components/task_list.vue'
Vue.component('task-list',TaskList)

export default{
	name:'list',
    component:{
         TaskList
      },
    data(){
    	return{
        titleContentBasic:'基本信息',
        titleContentForeclosure:'赎楼信息',
        shownote:true,
        noteContent:'• xxx——客户存在。。。。。 \n '+
                    '• xxx——该笔业务。。。。房产。。。。 \n '+
                    '• 上的发挥双方交流十分 \n '+
                    '• 获得了客户分类号',
        fileMessageBasic :[
          {
            name:'订单编号',
            message:'SZC0120240912001'
          },
          {
            name:'产品名称',
            message:'提放保(有赎楼)'
          },
          {
            name:'放款节点',
            message:'抵押递件放尾款'
          },
          {
            name:'客户姓名',
            message:'罗忠全'
          },
          {
            name:'关系人类型',
            message:'申请人'
          },
          {
            name:'身份证号',
            message:'XXXXXXXX'
          },
          {
            name:'客户联系方式',
            message:'135XXXXXXXX'
          },
          {
            name:'订单状态',
            message:'已面签'
          },
          {
            name:'渠道经理',
            message:'孙尚香'
          },
          {
            name:'渠道联系方式',
            message:'135XXXXXXXX'
          },
          {
            name:'中介联系人',
            message:'王晓霞'
          },
          {
            name:'中介联系方式',
            message:'135XXXXXXXX'
          },
          {
            name:'房产区域',
            message:'深圳市南山区'
          },
          {
            name:'房产地址',
            message:'铜鼓路39号大冲新城花园A栋23层E户'
          },
          {
            name:'合作机构',
            message:'渤海信托'
          },
          {
            name:'新贷款机构',
            message:'工商银行深圳宝安支行'
          },
        ],
        fileMessageForeclosure:[
          {
            name:'赎楼金额(元)',
            message:'200000'
          },
          {
            name:'自筹金额(元)',
            message:'170000'
          },
          {
            name:'商贷本金余额',
            message:'3000000'
          },
          {
            name:'原贷款机构',
            message:'交通银行深圳分行'
          },
        ]
    	}
    }
}
	
</script>