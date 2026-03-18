import { useStorage } from "@plasmohq/storage/hook"

import "~style.css"

/**
 * Options Page
 */
function IndexOptions() {
  const [commonTools, setCommonTools] = useStorage<any[]>("common-tools", [])
  return (
    <div className="w-100vw height-100vh p-16px">
      <h1>Options Page</h1>
    </div>
  )
}

export default IndexOptions
