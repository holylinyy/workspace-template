import { defineBuildConfig } from 'unbuild'
import path from 'pathe'
import fs from 'fs-extra'
export default defineBuildConfig({
  entries: ['./src/index'],
  clean: true,
  rollup: {
    emitCJS: true,
    cjsBridge: true,
  },
  alias: {
    '@': path.resolve(process.cwd(), 'src'),
  },
  failOnWarn: false,
  hooks: {
    'build:done': async () => {
      await fs.cp('./playground/.env', 'dist/server/.env', () => {})
    },
  },
})
