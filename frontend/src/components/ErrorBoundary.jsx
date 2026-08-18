import { Component } from "react";

/**
 * Catches uncaught render-time exceptions anywhere below it in the tree and shows a
 * recovery screen instead of letting React unmount the whole app to a blank white
 * page. React error boundaries only work as class components — there's no hook
 * equivalent (componentDidCatch/getDerivedStateFromError have no hook form).
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled error caught by ErrorBoundary:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
          <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            Something went wrong
          </h1>
          <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
            This page hit an unexpected error. Reloading usually fixes it — if it keeps
            happening, please let us know what you were doing.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
