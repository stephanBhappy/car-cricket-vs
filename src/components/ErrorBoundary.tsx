import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-on-surface font-body flex flex-col items-center justify-center px-6 text-center">
          <p className="font-headline font-black text-6xl text-secondary italic tracking-tighter mb-4">OOPS!</p>
          <p className="text-on-surface-variant text-lg mb-8 max-w-sm">Something went wrong. Try refreshing the page to get back in the game.</p>
          <button
            onClick={() => window.location.reload()}
            className="h-14 px-10 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-black text-lg uppercase tracking-tighter active:scale-95 transition-all"
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
