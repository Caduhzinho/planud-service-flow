import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  variant?: 'default' | 'dots' | 'pulse';
}

export const LoadingSpinner = ({ className, size = 'md', message, variant = 'default' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        );
      case 'pulse':
        return (
          <div className={cn("bg-indigo-600 rounded-full animate-pulse", sizeClasses[size], className)} />
        );
      default:
        return (
          <Loader2 className={cn("animate-spin", sizeClasses[size], className)} />
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      {renderSpinner()}
      {message && (
        <p className="text-sm text-gray-600 text-center">{message}</p>
      )}
    </div>
  );
};
