import React from "react"

const ColorConverter = ({ isSidepanel = false }: { isSidepanel?: boolean }) => {
  return <div>ColorConverter-{isSidepanel ? "true1" : "false1"}</div>
}

export default ColorConverter
