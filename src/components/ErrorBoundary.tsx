import { Component, type ErrorInfo, type ReactNode } from 'react'
import { TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

interface ErrorBoundaryProps {
  children: ReactNode
  title?: string
  message?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  resetKey: number
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, resetKey: 0 }

  static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState((state) => ({ hasError: false, resetKey: state.resetKey + 1 }))
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>{this.props.title ?? 'Something went wrong'}</AlertTitle>
          <AlertDescription className="flex flex-col items-start gap-3">
            <span>{this.props.message ?? 'This section failed to load.'}</span>
            <Button size="sm" variant="outline" onClick={this.handleReset}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )
    }

    return <div key={this.state.resetKey}>{this.props.children}</div>
  }
}
