import { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
                    <div className="glass-light rounded-3xl p-8 max-w-sm text-center">
                        <p className="text-4xl mb-4">🕌</p>
                        <h1 className="text-xl font-bold text-white mb-2">Something went wrong</h1>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                            Don't worry — try refreshing the page. If the problem persists, clear your browser data.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold py-2.5 px-6 rounded-xl text-sm"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;

