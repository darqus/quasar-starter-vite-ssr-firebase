import { Notify, } from 'quasar'

import { register, } from 'register-service-worker'

register(process.env.SERVICE_WORKER_FILE, {
  updated () {
    Notify.create({
      color: 'positive',
      icon: 'autorenew',
      message: '😇 Приложение обновилось. Перезагрузить страницу?',
      timeout: 0,
      multiLine: true,
      position: 'bottom',
      actions: [
        {
          label: 'Да',
          color: 'white',
          noCaps: true,
          handler: () => {
            location.reload()
          },
        },
        {
          label: 'Нет',
          color: 'white',
          noCaps: true,
          handler: () => {},
        },
      ],
    })
  },
})
