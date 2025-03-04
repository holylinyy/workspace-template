import consola from 'consola'
export const handleGlobalError = (app) => {
  app.on('error', (err) => {
    console.log('<============================================================')
    consola.error(err)
    console.log('============================================================>')
  })
}
