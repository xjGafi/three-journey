import './style.css';

// 普通组件
class BasisComponent extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `<div>Hello BasisComponent!</div>`;
  }
}
customElements.define('basis-component', BasisComponent);

// 使用沙箱隔离组件
class ShadowComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `<div>Hello ShadowComponent!</div>`;
  }
}
customElements.define('shadow-component', ShadowComponent);

// 使用沙箱隔离组件（带插槽）
class SlotComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `
      <div>Hello SlotComponent!</div>
      <slot></slot>
    `;
  }
}
customElements.define('slot-component', SlotComponent);
