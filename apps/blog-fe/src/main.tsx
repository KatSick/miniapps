import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";

const el = document.getElementById("root");

if (!el) throw new Error("No root");

createRoot(el).render(<App />);
