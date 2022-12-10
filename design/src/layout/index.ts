import './home'
import './error'
import './gallery'

window.$router.beforeEach(() => {
  const currentPage = location.pathname.slice(1)
  let layout = `<canvas id="webgl_${currentPage}"></canvas>`

  switch (currentPage) {
    case '':
      layout += '<home-component/>'
      break

    case 'error':
      layout += '<error-component/>'
      break

    default:
      layout += '<gallery-component/>'
      break
  }

  document.body.innerHTML = layout
})
