import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/design-system.css";
import "./index.css";

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  console.log("Mounting React app...");
  createRoot(rootElement).render(<App />);
  console.log("React app mounted successfully");
} catch (error) {
  console.error("Failed to mount React app:", error);
}
