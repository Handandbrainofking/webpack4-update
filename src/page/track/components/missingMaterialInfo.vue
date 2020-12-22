<!--
补件信息
-->


<template>
        <scroller :class="['missing-material',isEmpty&&'empty-ctn']">
            <div class="margintop45" v-for="group in missingMaterialsList" :key="group.id" >
                <div class="caption-row">
                    <text class="header-text">{{group.name}}</text>
                </div>
                <d-row class="">
                    <d-col :span="1"><text class="cell-text">资料上传意见</text></d-col>
                    <d-col :span="6"><text class="cell-text-opinion" lines="3">{{group.opinion}}</text></d-col>
                </d-row>
                <d-row class="header-row">
                    <d-col :span="2"><text class="title-text">资料名称</text></d-col>
                    <d-col :span="2"><text class="title-text">资料分类</text></d-col>
                    <d-col :span="6"><text class="title-text">备注信息</text></d-col>
                </d-row>
                <d-row v-for="(item, index) in group.materials" :key="item.id" :class="[index%2&&'row-bg-even']">
                    <d-col :span="2"><text class="cell-text">{{item.materialName}}</text></d-col>
                    <d-col :span="2"><text class="cell-text">{{item.materialTypeName}}</text></d-col>
                    <d-col :span="6"><text class="cell-text">{{item.remark}}</text></d-col>
                </d-row>
            </div>

            <div v-if="isEmpty">
              <div class="no-data-content-image">
                <d-image src="/image/icon-nodata.png" width="590" height="440"></d-image>
             </div>
             <text class="no-data-text">暂无数据</text>
           </div>
        </scroller>
</template>

<script>
import ReadInfo from "../../task/components/common/read_info.vue";
import  DCol from "@/core/Layout/DCol";
import  DRow from "@/core/Layout/DRow";

export default {
  name: "addMaterialInfo",
  props: {
    applyNo: {
      type: String
    }
  },
  components: {
    ReadInfo, DCol, DRow
  },
  data() {
    return {
      missingMaterialsList: [],
      isEmpty:false,
      nodeTypes: {
        //分组信息
        InputInfo: "录入待补件",
        Investigate: "审查待补件"
      }
    };
  },
  beforeMount() {
    const applyNo = this.applyNo;
    this.getApplyInfo(applyNo)
  },
  methods: {
    //取得订单信息
    getApplyInfo(applyNo) {
      this.requestApi.order_info({
        data: {
          applyNo: this.applyNo,
          relationKey: "missingMaterialsList"
        },
        success: data => {
          this.missingMaterialsList = this.groupMaterialsByNode(
            data.missingMaterialsList
          );
        }
      });
    },
    //对资料进行分组
    groupMaterialsByNode(items = []) {
      let nodes = {};
      for (let item of items) {
        let group = nodes[item.nodeId];
        if(item.deleteFlag !== 1){
          if (!group) {
            group = { id: item.nodeId, name: this.nodeTypes[item.nodeId], materials:[] };
            nodes[item.nodeId] = group;
          }
          if(item.materialTypeName==='资料上传意见'){
            group.opinion = item.remark;
          }else{
            group.materials.push(item);
          }
        }
      }

      this.isEmpty = !items.length;

      return nodes;
    }
  }
};
</script>

<style src="../trackcss.css" scoped>
</style>

<style lang="sass" type="text/scss" scoped>
.missing-material{
  flex: 1;
  padding-top: 30px;
  padding-right: 40px;
  padding-left: 40px;
  padding-bottom: 40px;
}

.caption-row{
  margin-bottom: 20px;
}

.header-row{
  background-color:#F5F6F9;
}

.header-text{
  font-size: 34px;

}
.title-text{
  font-size: 34px;
  color: #677475;
  padding-top: 23px;
  padding-bottom: 23px;
  padding-left:23px;
}
.cell-text{
  padding: 8px;
  color:  #030606;
  font-size:  30px;
  padding-top: 29px;
  padding-bottom: 29px;
  padding-left:23px;
}

.cell-text-opinion{
  @extend .cell-text;
  width: 2000px;
}

.row-bg-even{
  background-color:#FBFBFB;
}

.empty-ctn{
  align-items: center;
  justify-content: center;
}

.empty-tip{
  color:#677475;
}
.no-data-content-image {
  margin-bottom: 60px;
}
.no-data-text {
  font-size: 34px;
  color: #677475;
  text-align: center;
  width: 590px;
}
</style>

