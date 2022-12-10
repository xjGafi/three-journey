import style from './style.css?url'
import html from './template.html?raw'

const importImages = import.meta.glob('../../../assets/images/*.jpg')

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

    // 添加项目列表
    this.addViews()
  }

  async addViews() {
    const views = this.shadowRoot?.querySelector('#views')
    let list = ''
    for (const path in importImages) {
      const image = await importImages[path]() as any
      const url = image.default
      const number = url.match(/no(.*)\./)[1].slice(0, 3)
      list += `
        <li class="views__item">
          <a href="/${number}" class="views__item__link" target="_blank">
            <img class="views__item__image" src="${url}" />
            <p class="views__item__title">Open No.${number}</p>
          </a>
        </li>
      `
    }
    if (views)
      views.innerHTML = list
  }
}

// 注册 Shadow DOM 组件
customElements.define('home-layout', HomeLayout)
