
<template>
    <scroller class="card-ground">
      <div class="each-card" :key="remarkindex">
        <div class="card-title tosubmit-title">
          <text class="card-title-text">备注信息</text>
        </div>
        <div class="card-content">
          <div>
            <div class="mark-tip-wrap">
              <text class="mark-tip">{{ remarkLength }}/200</text>
            </div>
            <div class="yxzl">
              <div class="yxzl-width">
                <text class="yxzl-text">备注</text>
              </div>
              <textarea class="remark-content" rows="5" placeholder="请输入备注信息" maxlength="200" v-model="iditem.remark.text" @input="doInputMark()"></textarea>
            </div>
          </div>
        </div>    
        <div v-if="deleteFlag" class="mask-requirements" @click="preventMaskClick"></div> 
      </div>
    </scroller>
</template>

<script>

export default {
  name: "", //要件托管其他证件
  components: {
  },
  props: {
     deleteFlag: {
      type: Boolean,
      default: false
    }},
  created() {
    const applyNo = this.getPageParams("orderId", true) || 1;
    this.applyNo = applyNo;
  },
  beforeMount() {
  	this.iditem.remark = [];
  	this.iditem.remark.text="";
  },
  data() {
    return {
      applyNo: "",
      iditem: [],
      remarkLength:0
    };
  },
  computed: {},
  methods: { 
  	doInputMark() {
      const value = this.iditem.remark.text;
      if(this.iditem.remark.text.length > 200) {
        this.iditem.remark.text = value.substring(0, 200);
      }
      this.remarkLength = this.iditem.remark.text.length;
    },
    long(e) {
      return e.length;
    },
    preventMaskClick(e){
      e.preventDefault()
    }
  }
};
</script>

<style lang="sass" type="text/scss" scoped>
  @import '../components/interview/customer';

.card-ground {
  padding-top: 20px;
  padding-right: 150px;
  padding-left: 150px;
  flex: 1;
}
.each-card {
  width: 2220px;
  border-radius: 4px;
  border-color: #ddedf8;
  border-width: 2px;
  margin-bottom: 60px;
}
.card-title {
  height: 80px;
  padding-left: 20px;
  padding-right: 80px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}
.card-title-text {
  font-size: 30px;
  color: #21363d;
}
.tosubmit-title {
  background-color: #e8f3fb;
}
.card-content {
  flex-direction: row;
  flex-wrap: wrap;
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 40px;
}
.each-card-content {
  height: 96px;
}
.yxzl {
  padding-right: 40px;
  flex-direction: row;
}
.yxzl-width {
  margin-top: 31px;
  width: 330px;
}
.yxzl-text {
  color: #21363d;
  font-size: 34px;
  text-align: right;
}
.btn-add-text {
    font-size: 34px;
    color: $color_back;
}
.item {
  width: 1000px;
}
.title {
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
}
.remark-content {
  width: 1200px;
  height: 320px;
  line-height: 50px;
  padding-top: $normal_gap_left;
  padding-left: $normal_gap_left;
  padding-right: $normal_gap_left;
  padding-bottom: $normal_gap_left;
  margin-left: 35px;
  border-width: $condition-border + px;
  border-color: #CACCCF;
  border-radius: 4px;
  font-size: $font_nav;
}
.mark-tip-wrap {
  margin-left: 1480px;
  flex-direction: row-reverse;
}
.mark-tip {
  color: $color_back;
  font-size: $font_small;
}
.mask-requirements {
    position: absolute;
    bottom: 0;
    left: 0;
    width:2220px;
    height:400px;
}
</style>
