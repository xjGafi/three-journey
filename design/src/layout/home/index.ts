import style from './style.css?url'
import html from './template.html?raw'

class HomeComponent extends HTMLElement {
  constructor() {
    super()

    this.addClickEvent = this.addClickEvent.bind(this)

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

    // 创建图片导航
    const ul = document.createElement('ul')
    ul.setAttribute('class', 'views')
    let list = ''
    const importImages = import.meta.glob('../../../assets/images/*.jpg')
    for (const path in importImages) {
      const image = importImages[path].name
      const link = image.slice(-7, -4)
      list += `
      <li class="views__item">
        <a href="/${link}" class="views__item__link" target="_blank">
          <div class="views__item__image" style="background-image: url(${image});"></div>
          <p class="views__item__title">Open No.${link}</p>
        </a>
      </li>
      `
    }
    ul.innerHTML = list
    const views = document.importNode(ul, true)

    // 将所创建的元素添加到 Shadow DOM 上
    this.shadowRoot?.appendChild(stylesheet)
    this.shadowRoot?.appendChild(content)
    this.shadowRoot?.appendChild(views)

    // 添加事件
    this.addClickEvent('title', '/')
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
}

// 注册 Shadow DOM 组件
customElements.define('home-component', HomeComponent)
