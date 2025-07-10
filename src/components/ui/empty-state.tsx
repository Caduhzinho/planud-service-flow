import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: string;
  onClick?: () => void;
  to?: string;
  variant?: 'default' | 'error' | 'warning';
}

export const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action, 
  onClick, 
  to, 
  variant = 'default' 
}: EmptyStateProps) => {
  const handleClick = () => {
    if (to) {
      window.location.href = to;
    } else if (onClick) {
      onClick();
    }
  };

  const getIcon = () => {
    if (icon) return icon;
    
    switch (variant) {
      case 'error':
      case 'warning':
        return <AlertCircle className="h-12 w-12 text-orange-500" />;
      default:
        return <RefreshCw className="h-12 w-12 text-gray-400" />;
    }
  };

  const getColors = () => {
    switch (variant) {
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center space-y-4">
      {getIcon()}
      <div className="max-w-md space-y-2">
        <h3 className={`text-lg font-semibold ${getColors()}`}>
          {title}
        </h3>
        <p className="text-sm text-gray-500">
          {description}
        </p>
      </div>
      {action && (
        <Button onClick={handleClick} className="mt-4">
          {action}
        </Button>
      )}
    </div>
  );
};
