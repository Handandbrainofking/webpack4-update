import {
  pushRenderEvent,
  pushHttpEvent
} from '@/api/baiduStatService'
const events = {}

/**
 * 注册事件
 * @param {String} event 事件名称
 * @param {Function} handler 事件处理方法
 */
export const register = function register(event, handler) {
  // 非空处理
  events[event] = events[event] || []
  const _events = events[event]
  if (_events.indexOf(handler) === -1) {
    _events.push(handler)
  }
}

/**
 * 取消事件注册
 * @param {String} event 事件名称
 * @param {Function} handler 事件处理方法
 */
export const unregister = function unregister(event, handler) {
  const _events = events[event]
  if (!(_events instanceof Array)) return

  const index = _events.indexOf(handler)
  if (index !== -1) {
    _events.splice(index, 1)
  }
}

/**
 * 触发事件
 * @param {String} event 事件名称
 * @param  {...any} args 事件参数
 */
export const fireEvent = function fireEvent(event, ...args) {
  const _events = events[event] || []
  for (const handler of _events) {
    handler(...args)
  }
}

/**
 * http 处理事件
 */
export const httpEvent = {
  statistics: [],
  /**
   * HTTP请求开始事件
   * @param {String} uri 请求的URL
   * @param  {...any} args 请求的参数
   */
  httpStart(uri, ...args) {
    let statistic = {
      uri,
      start: Date.now().valueOf(),
      start_args: args
    }
    // uri 可能会有重复的，这里不做严格的区分
    this.statistics.push(statistic)
    fireEvent('http_start', this.statistics[uri])
  },
  /**
   * HTTP请求结束事件
   * @param {String} uri 请求的URL
   * @param {Number} contentSize 返回数据包体积
   * @param  {...any} args 请求的参数
   */
  httpEnd(uri, result) {
    const index = this.statistics.findIndex(x => x.uri === uri)
    if (!index === -1) return
    const statistic = this.statistics[index]

    statistic.end = Date.now().valueOf()
    statistic.contentSize = JSON.stringify(result).length
    statistic.duration = statistic.end - statistic.start
    // 抛出全局事件
    fireEvent('http_end', statistic)
    // 清理数据
    this.statistics.splice(index, 1)
  }
}

/**
 * 统计的mixin
 */
const statisticsMixin = {
  data() {
    return {
      statStartUpTime: Date.now(), // 启动时间
      isStatCommited: false,
      isHttpCompleted: false, // 是否 http 已经完成
      statistics: {
        http: []
      }
    }
  },
  computed: {
    isEnableStatistics() {
      return this.$options.statistics
    },
    statisticsKey() {
      return this.$options.statistics.split('|')[0]
    },
    statisticsName() {
      return this.$options.statistics.split('|')[1]
    }
  },
  created() {
    if (this.isEnableStatistics) {
      this.statisticsStart('static_render')
      // 注册HTTP勾子，只作结束标记
      register('http_end', this.onHttpEnd)
    }
  },
  mounted() {
    if (this.isEnableStatistics) {
      this.statisticsEnd('static_render')
      // 5秒后会默认提交统计数据
      setTimeout(() => this.commitStastics, 5000)
    }
  },
  beforeDestroy() {
    if (this.isEnableStatistics) {
      unregister('http_end', this.onHttpEnd)
      this.commitStastics()
    }
  },
  methods: {
    /**
     * 启动事件统计
     */
    statisticsStart(type, ...args) {
      this.statistics[type] = {
        start: Date.now().valueOf(),
        start_args: args
      }
    },
    /**
     * 触发完成事件
     */
    statisticsEnd(type, data) {
      const statistic = this.statistics[type]
      if (!statistic) return

      statistic.end = Date.now().valueOf()
      statistic.end_args = data
      statistic.duration = statistic.end - statistic.start
    },
    validateHttpEvent(statistic) {
      let events = this.statistics.http
      events = events.sort((a, b) => b.end - a.end)
      // 如果http 的开始时间与上个HTTP的结束时间超过300ms，则认为这不是一个批次的请求
      if (events && events.length) {
        const lastEvent = events[events.length - 1]
        if (statistic.start - lastEvent.end > 300) {
          this.isHttpCompleted = true
          return false
        }
      }

      // 如果比页面加载还早100ms发出的请求则忽略
      if (this.statStartUpTime - statistic.start >= 100) {
        // 如果HTTP请求发生在100ms以前的，我们认为是上次操作的记录
        return false
      }
      return true
    },
    /**
     * http 完成事件
     */
    onHttpEnd(statistic) {
      if (this.isHttpCompleted) {
        return
      }
      if (!this.validateHttpEvent(statistic)) return
      this.statistics.http.push(statistic)
    },
    /**
     * 重置统计记录
     */
    resetStasitcs() {
      this.statistics = {
        http: [],
        static_render: { // 重置的静态渲染时间为 0
          start: Date.now().valueOf(),
          end: Date.now().valueOf(),
          duration: 0
        }
      }
    },
    /**
     * 开始收集
     */
    startStasitcs() {
      this.resetStasitcs()
      this.statStartUpTime = Date.now()
      this.isStatCommited = false
      unregister('http_end', this.onHttpEnd)
      register('http_end', this.onHttpEnd)
    },
    /**
     * 提交渲染统计分析
     */
    _commitRenderStasitcs() {
      const static_render = this.statistics && this.statistics.static_render
      if (!static_render || !static_render.start) return

      // pushRenderEvent(this.statisticsKey, this.statisticsName, 'render', 1, static_render.duration)
      return {
        start: static_render.start,
        end: static_render.end,
        duration: static_render.duration
      }
    },
    /**
     * 提交 HTTP 统计分析
     */
    _commitHttpStasitcs() {
      // 因为HTTP是从created后才会做记录，所以这里不用考虑HTTP有没有过往的对它产生影响
      let events = this.statistics.http
      if (!events.length) return
      // 取得最小的开始时间
      const startSortedEvents = events.sort((a, b) => a.start - b.start)
      const start = startSortedEvents[0].start

      // 取得最大的结束时间
      const endSortedEvents = events.sort((a, b) => b.end - a.end)
      const end = endSortedEvents[0].end

      const duration = end - start
      pushHttpEvent(this.statisticsKey, this.statisticsName, events.length, duration)

      for (let e of events) {
        console.log(`baidu stat ${e.uri} ${e.start} ${e.end} ${e.duration}`)
      }

      // 返回所有HTTP的执行时间
      return {
        start,
        end,
        duration
      }
    },
    /**
     * 提交汇总分析
     */
    _commitSumStasitcs(renderStat, httpStat) {
      httpStat = httpStat || renderStat // 如果没有http状态，默认让它与渲染状态一致
      pushRenderEvent(this.statisticsKey, this.statisticsName, renderStat.duration, httpStat.duration, httpStat.end - renderStat.start)
    },
    /**
     * 提交到百度统计 (闲时进行提交)
     */
    commitStastics() {
      if (this.isStatCommited) return null
      const renderStat = this._commitRenderStasitcs()
      const httpStat = this._commitHttpStasitcs()
      const isExpired = Date.now() - this.statStartUpTime > 5000
      // 5S内没有检查到提交内容可以再次尝试
      if (!httpStat && !isExpired) {
        // 如果发现http未提交，可能是因为线程内执行的顺序不对，延时重提可以解决
        setTimeout(() => this.commitStastics(), 1000)
        return
      }
      this._commitSumStasitcs(renderStat, httpStat)
      this.resetStasitcs()
      // 只做一次收集，如果要多次收集，可以调用 startStasitcs()
      unregister('http_end', this.onHttpEnd)
      this.isStatCommited = true
    }
  }
}

/**
 * 统计插件
 */
const plugin = {
  install(Vue) {
    Vue.mixin(statisticsMixin)
  }
}

export default plugin
