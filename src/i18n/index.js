import { createI18n } from 'vue-i18n'
import Cookies from 'js-cookie'
import enLocale from './en'
import zhLocale from './zh'
import { getCurrentInstance }  from 'vue'
const messages = {
  en: {
    ...enLocale,
  },
  zh: {
    ...zhLocale,
  }
}
export function getLanguage() {
  const chooseLanguage = Cookies.get('language')
  if (chooseLanguage) return chooseLanguage

  // if has not choose language
  const language = (navigator.language || navigator.browserLanguage).toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }
  return 'en'
}

const i18n = createI18n({
  // set locale
  // options: en | zh
  locale: getLanguage(),
  // set locale messages
  messages
})

export function generateTitle(title) {
  const { ctx } = getCurrentInstance()
  const hasKey = ctx.$te('route.' + title)
  if (hasKey) {
    // $t :this method from vue-i18n, inject in @/lang/index.js
    const translatedTitle = ctx.$t('route.' + title)

    return translatedTitle
  }
  return title
}

export default i18n