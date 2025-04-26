import  { AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DuplicateVoteDetectedProps {
  originalTimestamp: string;
  electionTitle: string;
  onDismiss: () => void;
}

const DuplicateVoteDetected = ({
  originalTimestamp,
  electionTitle,
  onDismiss
}: DuplicateVoteDetectedProps) => {
  const navigate = useNavigate();
  
  const formattedDate = new Date(originalTimestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
          Duplicate Vote Detected
        </h2>
        
        <p className="text-gray-600 text-center mb-6">
          Our system has detected that you have already cast a vote in this election. 
          Duplicate votes are not allowed to ensure electoral integrity.
        </p>
        
        <div className="bg-red-50 rounded-lg p-4 border border-red-100 mb-6">
          <div className="flex flex-col space-y-3">
            <div className="flex items-start">
              <ShieldCheck className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
              <div>
                <p className="font-medium text-gray-900">Previous Vote Recorded</p>
                <p className="text-gray-700">
                  You already voted in "{electionTitle}" on {formattedDate}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
              <div>
                <p className="font-medium text-gray-900">Why am I seeing this?</p>
                <p className="text-gray-700">
                  This protection is in place to uphold the principle of "one person, one vote" 
                  and maintain the integrity of our democratic process.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            onClick={() => navigate('/results')}
            className="btn btn-secondary"
          >
            View Election Results
          </button>
          <button 
            onClick={onDismiss}
            className="btn btn-primary"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default DuplicateVoteDetected;
 