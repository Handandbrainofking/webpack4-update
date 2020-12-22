/**
 * function: 设置视图大小
 * author  : wq
 * update  : 2018-05-21 17:00
 */
const meta = weex.requireModule('meta')

// 配置 viewport 的宽度为 640px
try {
  meta.setViewport(
    {
      width: 2560
    }
  )
} catch (e) {
}

export default meta.setViewport
