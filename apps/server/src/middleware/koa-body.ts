import koaBody from 'koa-body'

const bodyParse = () => {
  return koaBody({
    jsonLimit: '10mb',
    multipart: true,
    formidable: {
      maxFileSize: 200 * 1024 * 1024,
      keepExtensions: true,
    },
  })
}

export default bodyParse
