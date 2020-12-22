import { shallowMount } from '@vue/test-utils'
import Component from '@test/utils/Component'
import head from '@/components/back/head'

describe('components/back/head.vue', () => {
  let comp = null

  beforeEach(() => {
    comp = new Component(shallowMount(head))
  })

  it('should render correct contents', () => {
    expect(comp.$el('text.back').text).toBe('返回')
    expect(comp.classes).toContain('back-box')
  })

  it('should has a back icon', () => {
    const img = comp.$el('d-image-stub')

    expect(img.attr('src')).toBe('/image/arrow-left.png')
    expect(img.attr('width')).toBe('40')
    expect(img.attr('height')).toBe('40')
  })

  it('should title text display correct', () => {
    let title = comp.$el('.title-wrapper')
    expect(title.attr('style')).toBe('padding-right: 245px;')
    comp.props = {rightWidth: 985}
    title = comp.$el('.title-wrapper')
    expect(title.attr('style')).toBe('padding-right: 985px;')
    comp.props = {backTitle: '测试'}
    title = comp.$el('.title-wrapper')
    expect(title.text).toBe('测试')
  })

  it('should back event emitted', () => {
    comp.vm.back = () => {
      comp.vm.$emit('sysback')
    } // 未加载mixin
    comp.vm.doBack()

    expect(comp.emitted.back).toBeTruthy()
    expect(comp.emitted.sysback).toBeTruthy()
  })

  it('should beforeBack invoke before back', () => {
    comp.vm.back = () => {
      comp.vm.$emit('sysback')
    } // 未加载mixin
    comp.props = {beforeBack: (cb) => {
      comp.vm.$emit('beforeBack')
      cb()
    }}
    comp.vm.doBack()
    expect(comp.emitted.back).toBeTruthy()
    expect(comp.emitted.beforeBack).toBeTruthy()
    expect(comp.emitted.sysback).toBeTruthy()
  })
})
