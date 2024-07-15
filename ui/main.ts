import { createRoot } from "react-dom/client";
import { createElement, StrictMode } from "react";
import { App } from "./App.js";

const root = createRoot(document.getElementById("app")!);
root.render(createElement(StrictMode, {}, createElement(App)));
