import axios from 'axios'
import { createRequestInterceptor } from './sdk'
const fetch = axios.create({
  withCredentials: true,
})

fetch.interceptors.request.use(((c) => {
  const fn = createRequestInterceptor()
  return fn(c)
}) as any)

export default fetch
