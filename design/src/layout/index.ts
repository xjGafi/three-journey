import './common'

window.$router.beforeEach(() => {
  const currentPage = location.pathname.slice(1)
  let layout
  let className

  switch (currentPage) {
    case '':
      className = 'home'
      layout = getHomeLayout()
      break

    case 'error':
      className = 'error'
      layout = getErrorLayout()
      break

    default:
      className = 'gallery'
      layout = getGalleryLayout(currentPage)
      break
  }

  document.body.setAttribute('class', className)
  document.body.innerHTML = layout
})

function getHomeLayout() {
  import('./home')
  return '<home-layout></home-layout>'
}

function getErrorLayout() {
  import('./error')
  return '<error-layout></error-layout>'
}

function getGalleryLayout(currentPage: string) {
  import('./gallery')
  return `<canvas id="webgl_${currentPage}"></canvas><gallery-layout></gallery-layout>`
}
