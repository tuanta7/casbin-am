import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import GlobalProvider from "./provider/GlobalProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GlobalProvider>
    <App />
  </GlobalProvider>
);
