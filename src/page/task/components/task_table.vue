<!-- 两行表格生成组件可配置文字数组  items-table和message-table -->
<template>
  <div class="table">
   <!--  div生成表格 -->
	<div class="table-row" v-for="item in itemsTable">
    <div class="table-cell">{{item.type}}</div>
	  <div class="table-cell">{{item.name}}</div>
	  <div class="table-cell">{{item.phone}}</div>
	  <div class="table-cell">{{item.marriage}}</div>
	  <div class="table-cell">{{item.work}}</div>
	  <div class="table-cell">{{item.company}}</div>
	  <div class="table-cell">{{item.person}}</div>
	  <div class="table-cell">{{item.mainperson}}</div>
	  <div class="table-cell-last">{{item.operation}}</div>
	</div>
   <div class="table-row" v-for="message in messageTable">
     <div class="table-cell border">{{message.type}}</div>
     <div class="table-cell border">{{message.name}}</div>
     <div class="table-cell border">{{message.phone}}</div>
     <div class="table-cell border">{{message.marriage}}</div>
     <div class="table-cell border">{{message.work}}</div>
     <div class="table-cell border">{{message.company}}</div>
     <div class="table-cell border">{{message.person}}</div>
     <div class="table-cell border">{{message.mainperson}}</div>
     <div class="table-cell-last border"></div>
   </div>
  </div>
</template>
<style scoped>
   .table{
   	margin-top:50px;
   	margin-left: 50px;
   }
   .table-row{
   	display: flex;
   	flex-direction: row;  
    justify-content: flex-start;	
   }
   .table-cell{
   	border-top-width:1px;
   	border-left-width:1px;
   	text-align: center;
   	padding-top:5px;
   	padding-bottom: 5px;
   	height:40px;
    width:100px;
   }
   .table-cell-last{
   	border-top-width:1px;
   	border-left-width:1px;
   	border-right-width:1px;
   	text-align: center;
   	padding-top:5px;
   	padding-bottom: 5px;
    height:40px;
    /*width:100px;*/
    flex-direction: row;
   }
   .border{
      border-bottom-width: 1px;
   }
	
</style>
<script>
  export default{
    //从父组件传递回两行的内容数组
    props:['itemsTable','messageTable']
 //    data() {
 //      return{
 //        items :[
 //      {
 //      	type:'关系人类型',
 //      	name:'姓名',
 //      	phone:'联系方式',
 //      	marriage:'婚姻状态',
 //      	work:'职业类型',
 //      	company:'单位名称',
 //      	person:'申请人',
 //      	mainperson:'主借款人',
 //      	operation:'操作'
 //      }
	// ],
 //   message:[
 //      {
 //         type:'关系人类型',
 //         name:'姓名',
 //         phone:'电话',
 //         marriage:'婚姻',
 //         work:'工作',
 //         company:'公司',
 //         person:'人',
 //         mainperson:'主要人',
 //         operation:'操作'
 //      }
 //   ]
 //  }
 // }

}
</script>