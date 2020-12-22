export default class Component {
  constructor(wrapper) {
    this.wrapper = wrapper
    this._props = {}
  }

  // #region properties

  /**
   * 元素 style 内容
   */
  get style() {
    return this.attr('style')
  }

  /**
   * 元素 class 列表
   */
  get classes() {
    return this.wrapper.classes()
  }

  /**
   * 元素 html 内容
   */
  get html() {
    return this.wrapper.html()
  }

  /**
   * 元素 html 内容
   */
  get text() {
    return this.wrapper.text()
  }

  /**
   * 取得 v-model 的值
   */
  get value() {
    return this.wrapper.element.value
  }

  /**
   * 设置v-model 的值
   */
  set value(val) {
    this.wrapper.setProps({value: val})
  }

  /**
   * input placeholder 值
   */
  get placeholder() {
    return this.attr('placeholder')
  }

  /**
   * input type 值
   */
  get type() {
    return this.attr('type')
  }

  /**
   * 取得事件列表
   */
  get emitted() {
    return this.wrapper.emitted()
  }

  /**
   * 设置 props
   */
  set props(props) {
    let _props = {...this._props, ...props}
    this.wrapper.setProps(_props)
  }

  /**
   * 设置 vm 的 data
   */
  set data(data) {
    this.wrapper.setData(data)
  }

  /**
   * 取得vue实例引用
   */
  get vm() {
    return this.wrapper.vm
  }

  /**
   * 取得原生element引用
   */
  get element () {
    return this.wrapper.element
  }

  /**
   * 元素是否为空元素
   */
  get isEmpty() {
    return this.wrapper.isEmpty()
  }

  /**
   * 元素是否可见
   */
  get isVisible() {
    return this.wrapper.isVisible()
  }

  /**
   * 元素是否为VUE实例
   */
  get isVueInstance() {
    return this.$el.wrapper.isVueInstance()
  }
  // #endregion

  // #region methods
  /**
   * 取得子元素的Helper类引用
   * @param {String} ref 选择器
   */
  $el(selector) {
    const $els = this.wrapper.findAll(selector)
    const result = []
    const length = $els.length
    for (let i = 0; i < length; i++) {
      result.push(new Component($els.wrappers[i]))
    }
    return result.length === 1 ? result[0] : result
  }

  /**
   * 获取组件属性值
   * @param {String} attr 属性名
   */
  attr(attr) {
    return this.wrapper.attributes(attr)
  }

  /**
   * 触发事件调用
   * @param {String} event 事件名称
   * @param {Oject} data 事件参数
   */
  trigger(event, data) {
    return this.wrapper.trigger(event, data)
  }

  /**
   * 检查事件是否按events的顺序调用，并返回 true / false
   * @param  {...any} events 事件列表
   */
  emittedOrder(...events) {
    for (let i = 0; i < events.length; i++) {
      if (this.wrapper.emittedByOrder()[i].name !== events[i]) return false
    }
    return true
  }

  /**
   * 是否包含有class
   * @param  {...string} classses class 列表
   */
  hasClass(...classses) {
    for (let cls of classses) {
      if (this.classes.indexOf(cls) === -1) {
        return false
      }
    }
    return true
  }

  /**
   * 确定是否包含子元素
   * @param {string} selector 选择器
   */
  contains(selector) {
    return this.wrapper.contains(selector)
  }

  /**
   * 判断当前的元素类型，如div, text ...
   * @param {string} type 元素类型
   */
  is(type) {
    return this.wrapper.is(type)
  }

  getProp(prop) {
    return this.wrapper.props(prop)
  }

  // #endregion
}
