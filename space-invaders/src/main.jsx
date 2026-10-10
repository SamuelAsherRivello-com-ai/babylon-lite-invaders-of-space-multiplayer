import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Content } from "./content/Content.jsx";
import { App } from "./ui/App.jsx";
import "./ui/style.css";

function AppComposition() {
  return (
    <App
      content={<Content />}
    />
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppComposition />
  </StrictMode>,
);
