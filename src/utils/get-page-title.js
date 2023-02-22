import defaultSettings from '@/settings'

const title = defaultSettings.title || '盖辰系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
