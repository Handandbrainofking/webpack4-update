<template>
  <wxc-common-pick
     :data-items="cityItems"
     @doSureChoose="doSureChoose"
     @doCancelChoose="doCancelChoose"
     @change="onCityValuesChange"></wxc-common-pick>
</template>

<script>
import WxcCommonPick from './pick.vue'
import { getDiscCity } from '@/dic'

export default {
  name: 'common-pick-city-box',
  components: {
    WxcCommonPick
  },
  props: {
    province: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      cityItems: [],
      _currentProvince: {},
      _currentCity: {},
    }
  },
  created() {
    let provinces = [], lastProvince, city = [];
    getDiscCity().then(data => {
      this.prompt = 'open'
      provinces = (this.provinceCitys = data || []).map(item => ({
        name: item.provinceName,
        key: item.provinceCode
      }))
      const provText = this.province
      const cityText = this.city
      let provIndex = 0, cityIndex = 0
      if (provText) {
        for (let i = 0; i < provinces.length; i++) {
          if (provinces[i].key === provText) {
            provIndex = i
            lastProvince = provinces[i]
            break
          }
        }
      } else {
        lastProvince = provinces[0]
      }
      city = this.switchCity(this.provinceCitys[provIndex].cityAndArea)
      this._currentProvince = lastProvince
      if (cityText) {
        for (let i = 0; i < city.length; i++) {
          if (city[i].key === cityText) {
            cityIndex = i
            break
          }
        }
      }
      this._currentCity = city[cityIndex]
      this.cityItems = [
        {
          width: 1,
          values: provinces,
          index: provIndex
        },
        {
          name: 'name',
          width: 2,
          values: city,
          index: cityIndex
        }
      ]
    })
  },
  methods: {
    onCityValuesChange(province, city) {
      this._currentCity = city
      if (!this._currentProvince || this._currentProvince.key !== province.key || !this._currentCity || !city) {
        this._currentProvince = province
        let provinceCitys = this.provinceCitys
        for (let i in provinceCitys) {
          if (provinceCitys[i]['provinceCode'] === province['key']) {
            this.cityItems[1].values = this.switchCity(provinceCitys[i]['cityAndArea'])
            break
          }
        }
      }
    },
    doCancelChoose() {
      this.$emit('doCancelChoose')
    },
    doSureChoose() {
      this.$emit('doSureChoose', this._currentProvince, this._currentCity)
    },
    switchCity(city) {
      return ('string' === typeof city && JSON.parse(city) || city || []).map(item => ({
        key: item.code,
        name: item.name
      }))
    }
  }
}
</script>
