<template>
  <wxc-dialog
     :show="true"
     width="1600"
     height="984"
     top="308"
     @wxcDialogConfirmBtnClicked="doSureChooseOrg"
     @wxcDialogCancelBtnClicked="doCancelChooseOrg">
    <div slot="title" class="title-wrap">
      <text class="title">公证受委托人</text>
    </div>
    <div class="content-wrap" slot="content">
      <div class="search-content">
        <div class="search-wrap">
          <d-image src="/image/search.png" width="36" height="38"></d-image>
          <input class="input" return-key-type="search" type="text" placeholder="搜索" @return="doSearch"
                 v-model="fullname" />
        </div>
      </div>
      <div class="info-content">
        <div class="info-title">
          <div class="info-title-each">
            <text class="info-text">姓名</text>
          </div>
          <div class="info-title-each">
            <text class="info-text">账号</text>
          </div>
          <div class="info-title-each">
            <text class="info-text">组织</text>
          </div>
        </div>
        <scroller class="list-content">
          <div v-for="(item, index) in showList" :key="index">
            <div class="list-each" :class="[item.choose == true ? choosed : nochoosed]" @click="choosePerson(index)">
              <div class="info-title-each">
                <text :class="[item.choose == true ? choosedtext : nochoosedtext]">{{ item.name }}</text>
              </div>
              <div class="info-title-each">
                <text :class="[item.choose == true ? choosedtext : nochoosedtext]">{{ item.account }}</text>
              </div>
              <div class="info-title-each">
                <text :class="[item.choose == true ? choosedtext : nochoosedtext]">{{ item.branch }}</text>
              </div>
            </div>
          </div>
        </scroller>
      </div>
    </div>
  </wxc-dialog>
</template>

<script>
import WxcDialog from '../../../../components/dialog/dialog.vue'
import loginApi from '../../../../utils/login'

export default {
  name: 'task-choose-entrust',
  components: {
    WxcDialog
  },
  props: {
    cardIndex: {
      type: Number
    },
    chooseList: {
      type: Array
    }
  },
  data() {
    return {
      showList: [],
      returnList: [],
      fullname: '',
      choosed: 'choosed',
      nochoosed: '',
      choosedtext: 'choosed-text',
      nochoosedtext: 'list-text'
    }
  },
  beforeMount() {
    this.requestList(this.fullname)
  },
  methods: {
    requestList(fullname) {
      this.requestApi.user_info({
        data: {
          fullname,
          companyCode: loginApi.getLoginData().companyCode,
          rolesArray: 'WQG,WQG1,WQG2,wqg3,YYZG',
          pageNo: 0,
          pageSize: 999
        },
        success: data => {
          if (data.list.length > 0) {
            data.list.forEach((item, index) => {
              for (var i in item.branchList) {
                var eachList = {
                  id: item.id,
                  name: item.fullname,
                  account: item.account,
                  branch: item.branchList[i].name,
                  choose: false
                }
                this.showList.push(eachList)
              }
            })
            for (var k in this.chooseList) {
              for (var j in this.showList) {
                if (this.chooseList[k].name == this.showList[j].name) {
                  this.showList[j].choose = true
                  this.returnList.push(this.showList[j])
                  break
                }
              }
            }
          }
        }
      })
    },
    doSearch() {
      this.showList = []
      this.requestList(this.fullname)
    },
    choosePerson(index) {
      if (this.showList[index].choose === false) {
        let flag = 0
        Vue.set(this.showList, index, Object.assign({}, this.showList[index], { choose: true }))
        for (var i in this.returnList) {
          if (this.returnList[i].id === this.showList[index].id) {
            flag = 1
          }
        }
        if (flag === 1) {
          return false
        } else {
          this.returnList.push(this.showList[index])
        }
      } else if (this.showList[index].choose === true) {
        Vue.set(this.showList, index, Object.assign({}, this.showList[index], { choose: false }))
        for (var i in this.returnList) {
          if (this.returnList[i].id === this.showList[index].id) {
            Vue.delete(this.returnList, i)
          }
        }
      }
    },
    doSureChooseOrg() {
      this.$emit('doSureChooseEntrust', this.returnList, this.cardIndex)
    },
    doCancelChooseOrg() {
      this.$emit('doCancelChooseEntrust')
    }
  }
}
</script>

<style lang="sass" type="text/scss" scoped>
  .title-wrap {
    height: 88px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: rgba(2, 179, 180, 1);
  }

  .title {
    font-size: 38px;
    color: #fff;
  }

  .content-wrap {
    height: 768px;
  }

  .search-content {
    height: 120px;
    justify-content: center;
    align-items: center;
  }

  .search-wrap {
    width: 1000px;
    height: 60px;
    border-width: $condition-border + px;
    border-color: $color_weak;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
  }

  .input {
    height: 60px;
    width: 800px;
    border-width: 0;
    border-radius: 4px;
    background-color: transparent;
  }

  .info-content {
    flex: 1;
    padding-right: 100px;
    padding-left: 100px;
  }

  .info-title {
    height: 88px;
    background-color: #F5F6F9;
    flex-direction: row;
    justify-content: space-between;
  }

  .list-each {
    height: 88px;
    flex-direction: row;
    justify-content: space-between;
    border-bottom-width: 1px;
    border-bottom-color: #EEEEEE;
  }

  .info-title-each {
    width: 500px;
    justify-content: center;
    align-items: center;
  }

  .info-text {
    color: #677475;
    font-size: 30px;
  }

  .list-text {
    font-size: 30px;
    color: #21363D;
  }

  .list-content {
    flex: 1;
  }

  .choosed {
    background-color: #EBF0F6;
  }

  .choosed-text {
    font-size: 30px;
    color: #02B3B4;
  }
</style>
