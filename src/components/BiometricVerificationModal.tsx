import  { useState, useEffect } from 'react';
import { X, Fingerprint, Camera, AlertTriangle, CheckCircle } from 'lucide-react';

interface BiometricVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationComplete: (success: boolean, matchPercentage: number) => void;
  verificationType: 'fingerprint' | 'facial';
  title: string;
  description: string;
}

const BiometricVerificationModal = ({
  isOpen,
  onClose,
  onVerificationComplete,
  verificationType,
  title,
  description
}: BiometricVerificationModalProps) => {
  const [verifying, setVerifying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<'success' | 'failed' | null>(null);
  const [matchPercentage, setMatchPercentage] = useState(0);

  // Simulate verification process
  const startVerification = () => {
    setVerifying(true);
    setProgress(0);
    setResult(null);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Generate a random match percentage between 30% and 100%
          const match = Math.floor(Math.random() * 71) + 30;
          setMatchPercentage(match);
          
          // Determine if verification passes or fails (>70% is considered a match)
          const success = match >= 70;
          setResult(success ? 'success' : 'failed');
          onVerificationComplete(success, match);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  useEffect(() => {
    if (isOpen) {
      startVerification();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 flex items-center justify-center bg-primary-100 rounded-full mb-4">
            {verificationType === 'fingerprint' ? (
              <Fingerprint className="h-8 w-8 text-primary-600" />
            ) : (
              <Camera className="h-8 w-8 text-primary-600" />
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>
        
        <div className="mb-6">
          {verifying && result === null && (
            <>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div 
                  className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-center text-sm text-gray-500">
                {verificationType === 'fingerprint' 
                  ? 'Analyzing fingerprint pattern...' 
                  : 'Analyzing facial features...'}
              </p>
            </>
          )}
          
          {result === 'success' && (
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">Verification Successful</p>
                <p className="text-green-700">
                  {matchPercentage}% match with your registered {verificationType === 'fingerprint' ? 'fingerprint' : 'facial identity'}.
                </p>
              </div>
            </div>
          )}
          
          {result === 'failed' && (
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Verification Failed</p>
                <p className="text-red-700">
                  Only {matchPercentage}% match with your registered {verificationType === 'fingerprint' ? 'fingerprint' : 'facial identity'}. Minimum required is 70%.
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="btn btn-primary"
          >
            {result === 'success' ? 'Continue' : result === 'failed' ? 'Try Again' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BiometricVerificationModal;
 