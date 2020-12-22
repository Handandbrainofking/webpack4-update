
<template>
    <div class="content">
        <div v-for="(column, index) in list" class="row"
            :key="index">
            <text  v-for="(item, idx) in column" :key="idx" class="row" :class="[item.light ? 'high-light' : 'common-text']">{{ item.content}}</text>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      column: []
    }
  },
  props: {
    keySet: {
      type: String,
      default: ''
    },
    dataString: {
      type: String,
      default: ''
    }
  },
  created() {
    this.getKeyWordList()
  },
  methods: {
    getKeyWordList() {
      this.list = []
      let keySet = this.keySet.replace(/,/g, '|')
      keySet += '|\\\n'
      let reg = new RegExp(keySet, 'ig')
      this.dataString = this.dataString.replace(/<[^>]+>/g, "");//删除html标记
      for (let subLine of this.dataString.split('\n')) {
        this.column = []
        let column = this.sliceString(subLine, reg)
        this.list.push(this.column)
      }
    },
    //TODO: ylh* html标红 截断式，格式不对，掺杂了html标签
    sliceString(subLine, reg) {
      let result = reg.exec(subLine)
      if (result) {
        let content = subLine.slice(0, result['index'])
        if(content) {
          this.column.push( {content: content} )
        }
        this.column.push( {content: result[0], light: true} )
        let newSubLine = subLine.slice(result['index'] + result[0].length)
        if (newSubLine) {
          this.sliceString(newSubLine, reg)
        }
      } else {
        this.column.push({ content: subLine })
      }
    }
  }
}
</script>

<style>
.content {
  margin: 0 20px 0 20px;
  width: 2160px;
}
.column {
  display: inline;
}
.row {
  width: 2160px;
  flex-direction: row;
  flex-wrap: wrap;
}
.high-light {
  font-size: 30px;
  color: #ee5253;
}
.common-text {
  font-size: 30px;
}
</style>

