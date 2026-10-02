import React from 'react';
import { AlertTriangle, RefreshCw, Presentation } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex-1 flex flex-col items-center justify-center p-8 text-center bg-zinc-900 text-white rounded-2xl m-4 border border-zinc-800 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-4 text-orange-500">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold font-space text-white mb-2">
            No pudimos mostrar esta vista
          </h2>
          <p className="text-sm text-zinc-400 max-w-md mb-6">
            Ocurrió un error inesperado al procesar los datos de la parrilla. Puedes intentar recargar la vista o volver al modo de diapositivas.
          </p>
          <div className="flex flex-wrap gap-3 items-center justify-center">
            {this.props.onFallbackToSlides && (
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  this.props.onFallbackToSlides();
                }}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-500/20"
              >
                <Presentation className="w-4 h-4" />
                <span>Volver a Diapositivas</span>
              </button>
            )}
            <button
              type="button"
              onClick={this.handleReset}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reintentar</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
