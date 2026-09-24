import { Component, ReactNode } from "react";

type State = { details: string | null; copyStatus: string };

export class ApplicationErrorBoundary extends Component<
  { children: ReactNode },
  State
> {
  state: State = { details: null, copyStatus: "" };

  static getDerivedStateFromError(error: unknown): Partial<State> {
    return {
      details:
        error instanceof Error
          ? (error.stack || `${error.name}: ${error.message}`).slice(0, 6000)
          : String(error).slice(0, 6000),
    };
  }

  copyDetails = async () => {
    try {
      await navigator.clipboard.writeText(this.state.details ?? "");
      this.setState({ copyStatus: "Copied" });
    } catch {
      this.setState({
        copyStatus: "Open Error details below to copy the message.",
      });
    }
  };

  render() {
    if (this.state.details === null) return this.props.children;

    return (
      <main
        style={{
          minHeight: "100vh",
          padding: "48px 24px",
          boxSizing: "border-box",
          background: "#141d2b",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <section style={{ maxWidth: 680, margin: "0 auto" }}>
          <h1>Unable to load Graphscan</h1>
          <p>
            Reload the page to try again. If the problem persists, send us the
            error details below.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <button
              style={{ minHeight: 44, padding: "8px 16px" }}
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
            <button
              style={{ minHeight: 44, padding: "8px 16px" }}
              onClick={this.copyDetails}
            >
              Copy error details
            </button>
          </div>
          <p role="status">{this.state.copyStatus}</p>
          <details>
            <summary>Error details</summary>
            <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
              {this.state.details}
            </pre>
          </details>
        </section>
      </main>
    );
  }
}
