<template>
<!-- 一列 列表生成组件可配置参数
title文字          titleContent
title显示          showtitle
title颜色          titleColor(默认#44CBB7)
表单数组           fileMessage[name:'',message:'']
表单头部长度       nameWidth 默认70
表单信息长度       messageWidth 默认90
备注显示           shownote(默认隐藏)
备注内容           noteContent(默认为空) -->
  <div>
    <div class="file">
      <!--  div生成list -->
      <div class="title" v-if="showtitle">
        <text class="font"  :style="{color:titleColor}">{{titleContent}}</text>
      </div>
      <div class="hr"></div>
      <div class="fileCloumn" v-for="item in fileMessage" :key="item">
        <div class="fileName" :style="{width:nameWidth+'px'}">
          <text class="fontname">{{item.name}}</text>
        </div>
        <div class="fileMessage" :style="{width:messageWidth+'px'}">
          <text class="fontmessage">{{item.message}}</text>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    nameWidth: {
      type: Number,
      default: 70
    },
    messageWidth: {
      type: Number,
      default: 90
    },
    titleColor: {
      type: String,
      default: "#44CBB7"
    },
    showtitle: {
      type: Boolean,
      default: true
    },
    shownote: {
      type: Boolean,
      default: false
    },
    titleContent: String,
    noteContent: {
      type: String,
      default: ""
    },
    fileMessage: Array
  },
  data() {
    return {};
  }
};
</script>

<style scoped>
.file {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 700px;
  margin-top: 10px;
}
.title {
  width: 700px;
}
.font {
  font-size: 10px;
}
.fontname {
  font-size: 10px;
  font-weight: bold;
}
.fontmessage {
  font-size: 10px;
  font-weight: normal;
}
.fileCloumn {
  display: flex;
  flex-direction: row;
  margin-left: 5px;
}
.fileName {
  padding-top: 10px;
  font-weight: bold;
}
.fileMessage {
  padding-top: 10px;
}
.notefile {
  padding-top: 10px;
}
.hr {
  border-top-width: 1px;
  border-top-color: #ccc;
  width: 700px;
  margin-top: 5px;
  margin-bottom: 10px;
}
.note {
  width: 700px;
  height: 100px;
  border-width: 1px;
  border-color: #ccc;
  font-size: 9px;
}
</style>