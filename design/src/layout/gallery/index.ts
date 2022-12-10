import style from './style.css?url'
import html from './template.html?raw'

class GalleryLayout extends HTMLElement {
  private previousPath: string
  private nextPath: string

  constructor() {
    super()

    this.previousPath = '/'
    this.nextPath = '/'

    this.addClickEvent = this.addClickEvent.bind(this)
    this.routeChange = this.routeChange.bind(this)
    this.updateNavBtn = this.updateNavBtn.bind(this)
    this.showNavBtn = this.showNavBtn.bind(this)

    // 添加 Shadow Root
    this.attachShadow({ mode: 'open' })
  }

  // 创建 Shadow DOM
  connectedCallback() {
    this.render()
  }

  // 销毁 Shadow DOM
  disconnectedCallback() {
  }

  // 渲染逻辑
  render() {
    // 创建 style
    const stylesheet = document.createElement('link')
    stylesheet.setAttribute('rel', 'stylesheet')
    stylesheet.setAttribute('href', style)

    // 创建 html
    const template = document.createElement('template')
    template.innerHTML = html
    const content = template.content.cloneNode(true)

    // 将所创建的元素添加到 Shadow DOM 上
    this.shadowRoot?.appendChild(stylesheet)
    this.shadowRoot?.appendChild(content)

    this.updateNavBtn()
    this.routeChange()

    // 添加事件
    this.addClickEvent('previous', this.previousPath)
    this.addClickEvent('next', this.nextPath)
  }

  // 给按钮绑定事件
  addClickEvent(id: string, path: string) {
    const button = this.shadowRoot?.querySelector(`#${id}`)
    button?.addEventListener(
      'click',
      () => window.$router.assign(path),
      false,
    )
  }

  routeChange() {
    // 路由改变后的钩子
    window.$router.afterEach(() => {
      // 修改底部切换按钮路由
      this.updateNavBtn()

      // 传给父组件：修改 No.xx, Github URL
      const currentPage = location.pathname.slice(1)
      const parent = this.shadowRoot?.querySelector('#parent')
      parent?.setAttribute('path', currentPage)
    })
  }

  updateNavBtn() {
    const currentPath = location.pathname
    const { routeConfigs } = window.$router

    const index = routeConfigs.findIndex(route => route.path === currentPath)
    const [minIndex, maxIndex] = [1, routeConfigs.length]

    // 上一个
    const previousIndex = index - 1
    let hasPrevious = true
    if (previousIndex > minIndex) {
      this.previousPath = routeConfigs[previousIndex].path
    }
    else {
      hasPrevious = false
      this.previousPath = currentPath
    }

    // 下一个
    const nextIndex = index + 1
    let hasNext = true
    if (nextIndex < maxIndex) {
      this.nextPath = routeConfigs[nextIndex].path
    }
    else {
      hasNext = false
      this.nextPath = currentPath
    }

    // 按钮显示或隐藏
    this.showNavBtn('previous', hasPrevious)
    this.showNavBtn('next', hasNext)
  }

  showNavBtn(id: string, show: boolean) {
    const button = this.shadowRoot?.querySelector(`#${id}`)
    button?.setAttribute('style', `display: ${show ? 'block' : 'none'}`)
  }
}

// 注册 Shadow DOM 组件
customElements.define('gallery-layout', GalleryLayout)
