// 加载网络js
// 用法 <load-network-js src="https://g.alicdn.com/dingding/dinglogin/0.0.2/ddLogin.js"></load-network-js>
export default {
  name: 'load-network-js',
  render(createElement) {
    return createElement('script', { attrs: { type: 'text/javascript', src: this.src } })
  },
  props: {
    src: { type: String, required: true }
  }
}
