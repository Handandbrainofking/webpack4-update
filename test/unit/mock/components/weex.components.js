import Vue from 'vue'
import JestMockComponent from './MockComponent'

const components = ['List', 'Cell', 'Loading', 'Refresh', 'RecycleList', 'Scroller', 'Slider', 'Indicator', 'Waterfall', 'Web', 'LoadingIndicator']
for (const component of components) {
  Vue.component(component, JestMockComponent)
}