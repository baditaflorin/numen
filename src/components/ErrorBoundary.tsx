import {
  Component,
  type ErrorInfo,
  type PropsWithChildren,
  type ReactNode,
} from "react";

type State = { error: Error | null };

export class ErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, _info: ErrorInfo): void {
    if (import.meta.env.DEV) console.error(error);
  }

  render(): ReactNode {
    if (!this.state.error) return this.props.children;
    return (
      <main className="fatal">
        <h1>Numen halted</h1>
        <p>{this.state.error.message}</p>
        <button type="button" onClick={() => location.reload()}>
          Reload
        </button>
      </main>
    );
  }
}
