/**
 * 获取 url 参数
 */
export const getUrlParams = (url?) => {
  const searchParams = new URLSearchParams(url || window.location.search)
  return Object.fromEntries(searchParams.entries())
}
