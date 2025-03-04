export type TLangMetaConfig = {
  baseOnBranch: string
  mainLang: string
  data: Record<string, any[]>
  translateData: Record<string, Record<string, any[]>>
}
