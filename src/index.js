import './assets/icons.js'

import Trevor from './components/main.vue'


panel.plugin('rasteiner/k3-trevor-view', {
  views: {
    trevor: {
      label: 'Trevor',
      icon: 'trevor',
      component: Trevor,
    }
  }
})
