import { useState } from "react"

function IndexPopup() {
  const [data, setData] = useState("")

  const openOptionsPage = () => {
    chrome.runtime.openOptionsPage()
  }

  const openTabPage = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("test.html") })
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
      </div>
      {data}
      <input
        onChange={(e) => setData(e.target.value)}
        value={data}
        style={{ marginTop: "16px" }}
      />
      <footer style={{ marginTop: "16px" }}>Crafted by FE-Tools</footer>
    </div>
  )
}

export default IndexPopup
