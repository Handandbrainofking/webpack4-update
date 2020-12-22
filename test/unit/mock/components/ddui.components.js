import Vue from 'vue'
import JestMockComponent from './MockComponent'

const components = ['DLayout', 'DLayoutScroll',
  'DAddList', 'DSidebar',
  'DImage', 'DIcon',
  'DTab', 'DTabPage', 'DButton',
  'DTable', 'DTableCell', 'DTableSwipeCell', 'DTableLineCell', 'DTableDefaultCell', 'DTableHead', 'DTableCheck', 'DPaging',
  'DForm', 'DFormView', 'DFormTitle',
  'DOverlay', 'DDialogFooter', 'DDialogUi', 'DPopup', 'DError', 'DSuccess', 'DDialogHead', 'DPicker',
  'DSearch', 'DSearchInput', 'DSearchTags', 'DSearchKeys', 'DSearchDate',
]
for (const component of components) {
  Vue.component(component, JestMockComponent)
}