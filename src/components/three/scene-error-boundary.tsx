"use client";

import { Component, type ReactNode } from "react";

/**
 * ErrorBoundary das cenas 3D: se o WebGL nao existir ou a cena lancar, cai
 * para o `fallback` estatico em vez de quebrar a pagina. Silencioso por design
 * (a falha de WebGL e esperada e o fallback ja comunica o estado). Telemetria
 * fica para o 7B com assets reais, se necessario.
 */
export class SceneErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {}

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
