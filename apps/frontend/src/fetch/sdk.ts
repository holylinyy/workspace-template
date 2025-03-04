const i = (e) => /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e),
  c = (e, r) => (r ? e.replace(/\/+$/, '') + '/' + r.replace(/^\/+/, '') : e),
  a = 'X-Pop-Token',
  n = async (e, r) => {
    const { default: t } = await import('@account/kso-acct-sdk'),
      s = await t.signPopToken(e, r)
    return s === 'empty' || !s ? {} : { [a]: s }
  },
  p = () => {
    try {
      if (typeof window > 'u') return (r) => r
    } catch {
      return (
        console.log('[Tips]: @uikit/axios-kso-sid will not run in nodejs.'),
        (r) => r
      )
    }
    const e = (r = {}) =>
      Object.keys(r).every((t) => t.toUpperCase() !== a.toUpperCase())
    return async (r) => {
      if (!e(r.headers) || r.__uikitCheckKsoSidHeader || (!r.url && !r.baseURL))
        return r
      let t, s
      const u = r.method?.toUpperCase() || 'GET'
      !r.url && r.baseURL && (t = r.baseURL),
        r.url &&
          (i(r.url)
            ? (t = r.url)
            : r.baseURL
              ? (t = c(r.baseURL, r.url))
              : (s = r.url.split('?')[0] || ''))
      try {
        if ((t && (s = new URL(t).pathname), !s)) return r
        const o = (await n(u, s)) || {}
        ;(r.headers = r.headers || {}), o[a] && (r.headers[a] = o[a])
      } catch (o) {
        console.error(
          `\u3010uikit\u3011\u83B7\u53D6\u5931\u8D25[X-Pop-Token]
`,
          o,
        )
      }
      return (r.__uikitCheckKsoSidHeader = !0), r
    }
  }
export { p as createRequestInterceptor, n as getHeader }
export default p
