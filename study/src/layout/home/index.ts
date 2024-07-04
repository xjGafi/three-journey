import { pages } from '../../router'

import style from './style.css?raw'
import html from './template.html?raw'

class HomeLayout extends HTMLElement {
  constructor() {
    super()

    this.addViews = this.addViews.bind(this)

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
    const styles = document.createElement('style')
    styles.textContent = style

    // 创建 html
    const template = document.createElement('template')
    template.innerHTML = html
    const content = template.content.cloneNode(true)

    // 将所创建的元素添加到 Shadow DOM 上
    this.shadowRoot?.appendChild(styles)
    this.shadowRoot?.appendChild(content)

    // 添加项目列表
    this.addViews()
  }

  async addViews() {
    const views = this.shadowRoot?.querySelector('#views')
    const list = pages.filter(({ name }) => name !== 'home').map(page => `
        <li class="views-item">
          <a href="${page.path}" class="views-item__link">
            <p class="views-item__title">Open No.${page.name.slice(2)}</p>
          </a>
        </li>
      `)
    if (views)
      views.innerHTML = list.join('')
  }
}

// 注册 Shadow DOM 组件
customElements.define('home-layout', HomeLayout)
