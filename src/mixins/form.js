export default {
  data() {
    return {
      transferYDistance: '0'
    }
  },
  computed: {
    formStyle() {
      if (this.transferYDistance) {
        return {
          transform: `translateY(${this.transferYDistance}px)`
        }
      } else {
        return { transform: 'none' }
      }
    }
  },
  methods: {
    transferY(distance) {
      this.transferYDistance = distance
    },
    onKeyboard(e, transferY) {
      if (e.isShow) {
        this.transferY(transferY)
      } else {
        this.transferY(0)
      }
    },
    onDisappear() {
      this.onKeyboard({
        isShow: false
      })
    }
  }
}
