import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        // You can log the error to an error reporting service here
        console.error('Uncaught error in ErrorBoundary:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">Something went wrong</h2>
                    <p className="text-sm text-gray-700 mb-4">An unexpected error occurred while rendering this part of the app.</p>
                    <details className="whitespace-pre-wrap bg-gray-50 p-3 rounded">
                        {String(this.state.error)}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
