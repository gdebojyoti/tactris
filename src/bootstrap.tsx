import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Tactris from "./ui/Tactris";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Tactris />
  </StrictMode>,
);
