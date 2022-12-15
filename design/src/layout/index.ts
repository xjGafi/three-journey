import './common'

window.$router.beforeEach(() => {
  const currentPage = location.pathname.slice(1)
  let layout = '<canvas id="webgl"></canvas>'
  let className = ''

  switch (currentPage) {
    case '':
      import('./home')
      className = 'home'
      layout += '<home-layout></home-layout>'
      break

    case 'error':
      import('./error')
      className = 'error'
      layout += '<error-layout></error-layout>'
      break

    default:
      import('./gallery')
      className = 'gallery'
      layout += '<gallery-layout></gallery-layout>'
      break
  }

  document.body.setAttribute('class', className)
  document.body.innerHTML = layout
})
