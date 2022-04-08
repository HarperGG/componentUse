import { createApp } from 'vue'
import App from './App.vue'
import naiveUI from 'naive-ui'

const app = createApp(App)

async function bootstrap() {
  app.use(naiveUI)

  app.mount('#app')
}

void bootstrap()
