import "~style.css"

import { Footer } from "./components/footer/footer"
import { Header } from "./components/header/header"
import { ToolsList } from "./components/tools-list"

/**
 * 点击插件图标弹层
 */
function IndexPopup() {
  return (
    <div className="w-200px flex flex-col">
      {/* 顶部 */}
      <Header />
      {/* 中部工具列表 */}
      <ToolsList />
      {/* 底部 */}
      <Footer />
    </div>
  )
}

export default IndexPopup
