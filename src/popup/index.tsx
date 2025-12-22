import { Button } from "antd"
import { navigateTo } from "~utils"
import "~style.css"

/**
 * 点击插件图标弹层
 */
function IndexPopup() {
  const openOptionsPage = () => {
    navigateTo({ type: "options" })
  }

  const openTabPage = () => {
    navigateTo({ type: "tabs", path: "/demo" })
  }

  const openSidebar = async () => {
    navigateTo({ type: "sidePanel" })
    window.close()
  }

  return (
    <div
      style={{
        width: "300px",
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      <h1>FE-Tools Extension</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginTop: "16px"
        }}>
        <button
          className="color-red"
          onClick={openOptionsPage}
          style={{
            padding: "8px 16px",
            backgroundColor: "#4285f4",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}>
          打开选项页面
        </button>
        <button
          onClick={openTabPage}
          style={{
            padding: "8px 16px",
            backgroundColor: "#34a853",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}>
          打开新标签页
        </button>
        <Button onClick={openSidebar}>打开 Sidebar</Button>
      </div>

      <footer style={{ marginTop: "16px" }}>Crafted by FE-Tools</footer>
    </div>
  )
}

export default IndexPopup
