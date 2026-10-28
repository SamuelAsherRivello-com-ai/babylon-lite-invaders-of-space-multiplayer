import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Content } from "./content/Content.jsx";
import { App } from "./ui/App.jsx";
import { MultiplayerClient } from "@rmc/multiplayer-client";
import { getRelayEndpoint } from "./content/game/connection-config.js";
import leftGutter from "./content/game/art/gutters/left.webp";
import rightGutter from "./content/game/art/gutters/right.webp";
import "./ui/style.css";

const createClient = options => new MultiplayerClient(getRelayEndpoint(import.meta.env), "space-invaders", options);

function AppComposition() {
  return (
    <App
      content={<Content createClient={createClient} />}
      gutters={{
        left: <img src={leftGutter} alt="" aria-hidden="true" />,
        right: <img src={rightGutter} alt="" aria-hidden="true" />,
      }}
    />
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppComposition />
  </StrictMode>,
);
