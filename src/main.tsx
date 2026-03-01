import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // For routing
import App from "./App";

createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
