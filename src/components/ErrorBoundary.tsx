import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      // Clear potentially corrupted or bloated storage
      localStorage.removeItem('bf_products');
    } catch (e) {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center font-mono">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-amber-400">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold font-sans text-white mb-2">BlackFits Engine Notice</h2>
          <p className="text-xs text-zinc-400 max-w-md mb-6 leading-relaxed">
            The system encountered a memory or storage limit constraint while rendering. Your catalog can be restored automatically.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded-xl border border-zinc-700 transition-colors"
            >
              Reload Page
            </button>
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset & Restore Defaults</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
