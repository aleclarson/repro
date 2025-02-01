import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

let app = <App />;

// Comment this out to see it work as intended.
app = <StrictMode>{app}</StrictMode>;

createRoot(document.getElementById("root")!).render(app);
