import  { X, User, Award } from 'lucide-react';

interface VoteResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: number;
  candidateName: string;
  candidateParty: string;
  candidateImage: string;
  votes: number;
  totalVotes: number;
}

const VoteResultModal = ({
  isOpen,
  onClose,
  candidateId,
  candidateName,
  candidateParty,
  candidateImage,
  votes,
  totalVotes
}: VoteResultModalProps) => {
  if (!isOpen) return null;

  const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  const isLeading = percentage > 33; // Arbitrary threshold for highlighting

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-1">Candidate Vote Results</h3>
          <p className="text-gray-600">
            Current voting statistics for this candidate
          </p>
        </div>
        
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full overflow-hidden mb-4">
              <img 
                src={candidateImage} 
                alt={candidateName} 
                className="h-full w-full object-cover"
              />
            </div>
            {isLeading && (
              <div className="absolute -right-2 -bottom-2 bg-yellow-400 p-2 rounded-full">
                <Award className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
          
          <h4 className="text-lg font-bold mb-1">{candidateName}</h4>
          <p className="text-gray-500 mb-4">{candidateParty}</p>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div 
              className="bg-primary-600 h-4 rounded-full"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between w-full text-sm text-gray-600">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Total Votes</p>
              <p className="text-2xl font-bold text-gray-900">{votes}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Percentage</p>
              <p className="text-2xl font-bold text-gray-900">{percentage}%</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            <User className="h-4 w-4 mr-1" />
            <span>Candidate ID: {candidateId}</span>
          </div>
          <button onClick={onClose} className="btn btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoteResultModal;
 