import  { AlertTriangle, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

interface DuplicateVoteAlertProps {
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  onClose?: () => void;
  showCloseButton?: boolean;
}

const DuplicateVoteAlert = ({
  type,
  title,
  message,
  onClose,
  showCloseButton = true
}: DuplicateVoteAlertProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  const getAlertStyles = () => {
    switch (type) {
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          icon: <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />,
          title: 'text-yellow-800',
          message: 'text-yellow-700'
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-200',
          icon: <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />,
          title: 'text-red-800',
          message: 'text-red-700'
        };
      case 'success':
        return {
          container: 'bg-green-50 border-green-200',
          icon: <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />,
          title: 'text-green-800',
          message: 'text-green-700'
        };
      case 'info':
      default:
        return {
          container: 'bg-primary-50 border-primary-200',
          icon: <AlertCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />,
          title: 'text-primary-800',
          message: 'text-primary-700'
        };
    }
  };

  const styles = getAlertStyles();

  return (
    <div className={`border rounded-lg p-4 mb-6 flex items-start gap-3 ${styles.container}`}>
      {styles.icon}
      <div className="flex-grow">
        <p className={`font-medium ${styles.title}`}>{title}</p>
        <p className={styles.message}>{message}</p>
      </div>
      {showCloseButton && (
        <button onClick={handleClose} className="flex-shrink-0 mt-0.5">
          <X className="h-5 w-5 text-gray-400 hover:text-gray-500" />
        </button>
      )}
    </div>
  );
};

export default DuplicateVoteAlert;
 