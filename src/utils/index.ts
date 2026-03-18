/**
 * 插件路由跳转
 * @param type 路由类型
 * @param path 路由路径  @example /demo => tabs/demo.html
 */
export const navigateTo = async ({
  type,
  path,
  query
}: {
  type: "options" | "tabs" | "sidePanel"
  path?: string
  query?: Record<string, string>
}) => {
  // 打开 options 页面
  if (type === "options") {
    chrome.runtime.openOptionsPage()
  }
  // 打开新的 tab 页
  if (type === "tabs" && path) {
    const p = path.startsWith("/") ? path.slice(1) : path
    const queryString = query ? `${new URLSearchParams(query).toString()}` : ""
    chrome.tabs.create({
      url: chrome.runtime.getURL(`tabs/${p}.html?${queryString}`)
    })
  }

  // 在当前tab页，打开 sidePanel
  if (type === "sidePanel") {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    chrome.sidePanel.open({ tabId: tab.id })
  }
}

export const getUrlParams = (url?) => {
  const searchParams = new URLSearchParams(url || window.location.search)
  return Object.fromEntries(searchParams.entries())
}
