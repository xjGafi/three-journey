import './common'

const initLayout = (appId: string) => {
  const layout = `
  <common-component/>
  `
  const app = document.querySelector<HTMLElement>(appId)!
  app.innerHTML = layout
}

export default initLayout
