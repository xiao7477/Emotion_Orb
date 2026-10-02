import React from "react";
import { createRoot } from "react-dom/client";
import { SphereLab } from "./SphereLab";
import { PortraitLab } from "./PortraitLab";
import { SunCreatureLab } from "../../../sun-creature/demo/src/SunCreatureLab";
import "./sphere.css";
import "./base.css";
import "../../../sun-creature/demo/src/sun-creature-lab.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {window.location.pathname === "/sun-creature" ? (
      <SunCreatureLab />
    ) : window.location.pathname === "/portrait" ? (
      <PortraitLab />
    ) : window.location.pathname === "/sphere" ? (
      <SphereLab />
    ) : (
      <SphereLab />
    )}
  </React.StrictMode>,
);
