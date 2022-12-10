import './common'
import './home'
import './error'
import './gallery'

window.$router.beforeEach(() => {
  const currentPage = location.pathname.slice(1)
  let layout

  switch (currentPage) {
    case '':
      layout = '<home-layout></home-layout>'
      break

    case 'error':
      layout = '<error-layout></error-layout>'
      break

    default:
      layout = `<canvas id="webgl_${currentPage}"></canvas><gallery-layout></gallery-layout>`
      break
  }

  document.body.innerHTML = layout
})
