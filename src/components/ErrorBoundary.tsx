import React from 'react';

interface State {
  hasError: boolean;
  error?: Error | null;
}

interface Props {
  children?: React.ReactNode;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('Uncaught error in React component tree:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Se produjo un error en la aplicación</h2>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#a00' }}>{String(this.state.error)}</pre>
          <p>Abre la consola del navegador para ver la traza completa.</p>
        </div>
      );
    }
    return this.props.children as React.ReactNode;
  }
}
