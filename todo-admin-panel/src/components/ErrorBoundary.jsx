import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Hata oluştu:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-center">
          <h2 className="text-xl font-bold text-red-600">Bir hata oluştu.</h2>
          <p className="text-gray-600">Lütfen daha sonra tekrar deneyin.</p>
        </div>
      );
    }

    return this.props.children;
  }
}