import style from './style.css?url'
import html from './template.html?raw'

class ErrorLayout extends HTMLElement {
  constructor() {
    super()

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
  }
}

// 注册 Shadow DOM 组件
customElements.define('error-layout', ErrorLayout)
