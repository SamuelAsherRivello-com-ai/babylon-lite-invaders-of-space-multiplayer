import { useCallback, useEffect, useState } from "react";
import versionText from "../../../version.txt?raw";
import { ContentShellProvider } from "../shared/ContentShellContext.jsx";
import { BrowserSurface } from "./BrowserSurface.jsx";
import { defaultLayout } from "./layout.js";
import { Dialog } from "./Dialog.jsx";

export function Corner({ position, children }) {
  return <div className={`corner corner_${position}`}>{children}</div>;
}

export function App({ layout = defaultLayout, content = null, contentPresentation = null, gutters = {} }) {
  const [settings, setSettings] = useState(false);
  const [isFullscreen, setFullscreen] = useState(false);
  const [viewportPixels, setViewportPixels] = useState({ width: 0, height: 0 });
  const updateViewportPixels = useCallback(r => setViewportPixels({ width: r.width, height: r.height }), []);
  const versionNumber = versionText.trim().replace(/^version=/, "");
  const fullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { /* The settings button remains usable if fullscreen is denied. */ }
  };
  useEffect(() => {
    const changed = () => {
      setFullscreen(Boolean(document.fullscreenElement));
      try { localStorage.setItem('space-invaders.fullscreen', String(Boolean(document.fullscreenElement))); } catch {}
    };
    const key = e => {
      if (/input|textarea/i.test(e.target.tagName)) return;
      if (e.key.toLowerCase() === "f") void fullscreen();
      if (e.key === "Escape") setSettings(false);
    };
    window.addEventListener("keydown", key);
    document.addEventListener('fullscreenchange', changed);
    return () => { window.removeEventListener("keydown", key); document.removeEventListener('fullscreenchange', changed); };
  }, []);
  const Readout = contentPresentation?.Readout;
  const Settings = contentPresentation?.Settings;
  return <ContentShellProvider paused={settings}>
    <BrowserSurface layout={layout} onViewportResize={updateViewportPixels} gutters={gutters} forceCompactGutters={isFullscreen} ui={<>
      <Corner position="top_left"><div className="corner-title">SPACE INVADERS<span className="corner-subtitle">INVADERS OF SPACE</span></div></Corner>
      <Corner position="top_right"><a className="corner-body" href="https://github.com/SamuelAsherRivello-com-ai/babylon-lite-invaders-of-space-multiplayer" target="_blank" rel="noopener noreferrer" aria-label="Game source on GitHub">SOURCE ↗</a></Corner>
      <Corner position="bottom_left"><button className="corner_option" onClick={() => setSettings(true)}>⚙ SETTINGS</button></Corner>
      <Corner position="bottom_right"><div className="corner-body">v{versionNumber}</div>{Readout && <Readout hudVisible={false} viewportPixels={viewportPixels} devicePixelRatio={window.devicePixelRatio || 1} openSettings={() => setSettings(true)} />}</Corner>
      {settings && <Dialog title="Settings" onClose={() => setSettings(false)}>
        <p>Your controls pause while this menu is open. The shared world continues.</p>
        <label><input type="checkbox" checked={isFullscreen} onChange={() => void fullscreen()} /> Fullscreen (F)</label>
        <p>Move: A / D or ← / →<br />Fire: Space or the touch buttons.</p>
        <p>Three lives each. Survive together. Defeat resets the team after five seconds.</p>
        {Settings && <Settings />}
        <button onClick={() => setSettings(false)}>Resume controls</button>
      </Dialog>}
    </>}>{content}</BrowserSurface>
  </ContentShellProvider>;
}
