import style from './style.css?raw'
import html from './template.html?raw'

class CommonLayout extends HTMLElement {
  static get observedAttributes() {
    return ['path']
  }

  constructor() {
    super()

    this.addClickEvent = this.addClickEvent.bind(this)
    this.updateGithub = this.updateGithub.bind(this)

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

  attributeChangedCallback(name: string, _: unknown, newValue: unknown) {
    if (name === 'path')
      this.updateGithub(newValue as string)
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

  updateGithub(currentPage: string) {
    if (Number(currentPage) > 0) {
      // github label
      const githubLabel = this.shadowRoot?.querySelector('#githubLabel')
      if (githubLabel) {
        githubLabel.innerHTML = `No.${currentPage}`
        githubLabel.setAttribute('style', 'display: block')
      }

      // github link
      const basePath = 'https://github.com/xjGafi/three-journey/blob/master/lessones'
      const githubLink = this.shadowRoot?.querySelector<HTMLLinkElement>('#githubLink')
      if (githubLink)
        githubLink.href = `${basePath}/src/views/no${currentPage}/index.ts`
    }
  }
}

// 注册 Shadow DOM 组件
customElements.define('common-layout', CommonLayout)
