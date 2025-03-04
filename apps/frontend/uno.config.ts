import {
  UserConfig,
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
} from 'unocss'
export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetIcons()],
} as UserConfig)
