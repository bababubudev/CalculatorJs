import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"

import "./styles/style.scss"
import OptionsProvider from "./context/OptionsProvider.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <OptionsProvider>
      <App />
    </OptionsProvider>
  </React.StrictMode>,
)
