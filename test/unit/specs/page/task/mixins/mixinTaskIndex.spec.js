/**
 * function: task_redemption_register.js
 * author  : wq
 * update  : 2019/3/5 9:45
 */
import Vue from 'vue'
import { shallowMount, mount } from '@vue/test-utils'
import Component from '@test/utils/Component'
import MixinTaskIndex from '@/page/task/mixins/mixinTaskIndex'

describe('mixinTaskIndex  测试', () => {
  let comp = null
  let vm = null

  beforeEach(() => {
    comp = new Component(shallowMount(Vue.component('test_comp', {
      template: `
      <DDialog :show="true">        
        <div class="main-item" slot="footer" />        
      </DDialog>
      `,
      mixins: [MixinTaskIndex]
    })))
    vm = comp.vm
  })

  it('deepAssignObject 方法 赋值已存在的对象在享有的对象上  测试', async () => {
    let obj1 = {a: 1}
    let obj2 = {b: 2}
    let obj = vm.deepAssignObject(obj1, obj2)
    expect(obj).toEqual({
      a: 1,
      b: 2
    })
    obj1 = {a: 1, b: 3}
    obj2 = {b: 2, c: 4}
    obj = vm.deepAssignObject(obj1, obj2)
    expect(obj).toEqual({
      a: 1,
      b: 2,
      c: 4
    })
  })

  describe('validateChildren validate 方法 验证子  测试', () => {
    const compC = Vue.extend({
      template: '<div>1111</div>',
      methods: {
        doValidate(bool) {
          return !!bool
        }
      }
    })
    const compD = Vue.extend({
      template: '<div>1111</div>',
      methods: {
        doValidate(bool) {
          return !!bool
        }
      }
    })
    const compB = Vue.extend({
      template: '<div><component-c ref="valid-component-c"></component-c><component-d ref="valid-component-d"></component-d></div>',
      mixins: [MixinTaskIndex],
      components: {
        ComponentC: compC,
        ComponentD: compD
      }
    })
    const compA = Vue.extend({
      template: '<component-b ref="valid-component-b"></component-b>',
      components: {
        ComponentB: compB
      },
      mixins: [MixinTaskIndex]
    })
    let comp = null
    let vm = null

    beforeEach(() => {
      comp = new Component(mount(compA))
      vm = comp.vm
    })

    it('validateChildren 方法 验证子组件  测试', async () => {
      const info = vm.doValidate()
      expect(info).toBe(false)
      const info1 = vm.doValidate(true)
      expect(info1).toBe(true)
    })

    it('validateChildren 方法 验证子组件 对象  测试', async () => {
      compC.options.methods['doValidate'] = function (bool) {
        return {
          A: 111,
          B: 222
        }
      }
      compD.options.methods['doValidate'] = function (bool) {
        if (bool) {
          return {
            C: 111,
            D: 222
          }
        } else {
          return {
            B: 3333,
            D: 222
          }
        }
      }
      const vm = mount(compA).vm
      const info = vm.doValidate()
      expect(info).toEqual({
        A: 111,
        B: 3333,
        D: 222
      })
      const info1 = vm.doValidate(true)
      expect(info1).toEqual({
        A: 111,
        B: 222,
        C: 111,
        D: 222
      })
    })

    it('validateChildren 方法 验证子组件 false true false 对象合并  测试', async () => {
      compC.options.methods['doValidate'] = function (bool) {
        return false
      }
      compD.options.methods['doValidate'] = function (bool) {
        if (bool) {
          return {
            C: 111,
            D: 222
          }
        } else {
          return true
        }
      }
      const vm = mount(compA).vm
      const info = vm.doValidate()
      expect(info).toBe(false)
      const info1 = vm.doValidate(true)
      expect(info1).toBe(false)
    })

    it('validateChildren 方法 验证子组件 true 对象 合并  测试', async () => {
      compC.options.methods['doValidate'] = function (bool) {
        return true
      }
      compD.options.methods['doValidate'] = function (bool) {
        return {
          C: 111,
          D: 222
        }
      }
      const vm = mount(compA).vm
      const info = vm.doValidate()
      expect(info).toEqual({
        C: 111,
        D: 222
      })
    })
  })

  describe('uploadChildrenCameraImage uploadCameraImage 方法 上传拍照图片  测试', () => {
    let times = 0
    const compC = Vue.extend({
      template: '<div>1111</div>',
      methods: {
        uploadCameraImage() {
          times = times + 1
        }
      }
    })
    const compD = Vue.extend({
      template: '<div>1111</div>'
    })
    const compB = Vue.extend({
      template: '<div><component-c ref="valid-component-c"></component-c><component-d ref="valid-component-d"></component-d></div>',
      mixins: [MixinTaskIndex],
      components: {
        ComponentC: compC,
        ComponentD: compD
      }
    })
    const compA = Vue.extend({
      template: '<component-b ref="valid-component-b"></component-b>',
      components: {
        ComponentB: compB
      },
      mixins: [MixinTaskIndex]
    })
    let comp = null
    let vm = null

    beforeEach(() => {
      comp = new Component(mount(compA))
      vm = comp.vm
    })

    it('uploadChildrenCameraImage 方法 验证子组件  测试', async () => {
      vm.uploadCameraImage()
      expect(times).toBe(1)
    })

    it('uploadChildrenCameraImage 方法 验证子组件  测试', async () => {
      compD.options.methods['uploadCameraImage'] = function (bool) {
        times = times + 1
      }
      const vm = mount(compA).vm
      times = 0
      vm.uploadCameraImage()
      expect(times).toBe(2)
    })
  })

  describe('resetChildrenInfo 方法 重置对象  测试', () => {
    let times = 0
    const compC = Vue.extend({
      template: '<div>1111</div>',
      methods: {
        resetInfo() {
          times = times + 1
        }
      }
    })
    const compD = Vue.extend({
      template: '<div>1111</div>'
    })
    const compB = Vue.extend({
      template: '<div><component-c ref="valid-component-c"></component-c><component-d ref="valid-component-d"></component-d></div>',
      mixins: [MixinTaskIndex],
      components: {
        ComponentC: compC,
        ComponentD: compD
      }
    })
    const compA = Vue.extend({
      template: '<component-b ref="valid-component-b"></component-b>',
      components: {
        ComponentB: compB
      },
      mixins: [MixinTaskIndex]
    })
    let comp = null
    let vm = null

    beforeEach(() => {
      comp = new Component(mount(compA))
      vm = comp.vm
    })

    it('resetChildrenInfo 方法 验证子组件  测试', async () => {
      vm.resetInfo()
      expect(times).toBe(1)
    })

    it('resetChildrenInfo 方法 验证子组件  测试', async () => {
      compD.options.methods['resetInfo'] = function (bool) {
        times = times + 1
      }
      const vm = mount(compA).vm
      times = 0
      vm.resetInfo()
      expect(times).toBe(2)
    })
  })
})
