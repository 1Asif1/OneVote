import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, User, AlertCircle, Fingerprint, Camera } from 'lucide-react';
import { elections } from '../data/mockData';
import { useVote } from '../context/VoteContext';
import DuplicateVoteAlert from '../components/DuplicateVoteAlert';
import BiometricVerificationModal from '../components/BiometricVerificationModal';
import DuplicateVoteDetected from '../components/DuplicateVoteDetected';

const CastVote = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [verificationStep, setVerificationStep] = useState<'selection' | 'verify' | 'success'>('selection');
  const [fingerprintVerified, setFingerprintVerified] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  const [fingerprintMatchPercentage, setFingerprintMatchPercentage] = useState(0);
  const [faceMatchPercentage, setFaceMatchPercentage] = useState(0);
  const [showFingerprintModal, setShowFingerprintModal] = useState(false);
  const [showFacialModal, setShowFacialModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateInfo, setDuplicateInfo] = useState<{timestamp: string, electionTitle: string} | null>(null);
  const [votingComplete, setVotingComplete] = useState(false);
  const [voteReceipt, setVoteReceipt] = useState<string | null>(null);
  
  const { registerVote, checkDuplicateVote, currentUser } = useVote();
  const navigate = useNavigate();

  const activeElection = elections.find(e => e.status === 'active');

  // Check for duplicate vote on component mount
  useEffect(() => {
    const checkForDuplicate = async () => {
      if (!activeElection) return;
      
      const { isDuplicate, originalVote } = await checkDuplicateVote(
        activeElection.id, 
        currentUser.voterId
      );
      
      if (isDuplicate && originalVote) {
        setDuplicateInfo({
          timestamp: originalVote.timestamp,
          electionTitle: activeElection.title
        });
        setShowDuplicateModal(true);
      }
    };
    
    checkForDuplicate();
  }, [activeElection]);

  const handleCandidateSelect = (candidateId: string) => {
    setSelectedCandidate(candidateId);
  };

  const handleProceedToVerification = () => {
    setVerificationStep('verify');
  };

  const simulateFingerprintVerification = () => {
    setShowFingerprintModal(true);
  };

  const handleFingerprintVerificationComplete = (success: boolean, matchPercentage: number) => {
    setFingerprintMatchPercentage(matchPercentage);
    setFingerprintVerified(success);
    setShowFingerprintModal(false);
  };

  const simulateFaceVerification = () => {
    setShowFacialModal(true);
  };

  const handleFaceVerificationComplete = (success: boolean, matchPercentage: number) => {
    setFaceMatchPercentage(matchPercentage);
    setFaceVerified(success);
    setShowFacialModal(false);
  };

  const handleCastVote = async () => {
    if (!activeElection || !selectedCandidate) return;
    
    const result = await registerVote(activeElection.id, selectedCandidate);
    
    if (result.success) {
      setVoteReceipt(result.receiptNumber || null);
      setVerificationStep('success');
      setVotingComplete(true);
    } else {
      // If duplicate vote detected
      if (result.message.includes("Duplicate vote")) {
        const { isDuplicate, originalVote } = await checkDuplicateVote(
          activeElection.id, 
          currentUser.voterId
        );
        
        if (isDuplicate && originalVote) {
          setDuplicateInfo({
            timestamp: originalVote.timestamp,
            electionTitle: activeElection.title
          });
          setShowDuplicateModal(true);
        }
      }
    }
  };

  const handleFinish = () => {
    navigate('/dashboard');
  };

  if (!activeElection) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto card">
          <div className="text-center py-8">
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Elections</h3>
            <p className="text-gray-600 mb-6">There are no active elections available for voting at the moment.</p>
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto card">
        {verificationStep === 'selection' && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{activeElection.title}</h1>
              <p className="text-gray-600">{activeElection.description}</p>
            </div>

            <DuplicateVoteAlert
              type="info"
              title="Secure Voting"
              message="Our system uses advanced biometric verification to prevent duplicate voting and ensure electoral integrity. Each voter can only vote once per election."
            />

            <h2 className="text-lg font-semibold mb-4">Select Your Candidate</h2>
            <div className="space-y-4 mb-8">
              {activeElection.candidates.map((candidate) => (
                <div 
                  key={candidate.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedCandidate === candidate.id 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => handleCandidateSelect(candidate.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <img src={candidate.image} alt={candidate.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold">{candidate.name}</h3>
                      <p className="text-gray-500 text-sm">{candidate.party}</p>
                      <p className="text-gray-600 text-sm">{candidate.position}</p>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center">
                      {selectedCandidate === candidate.id && (
                        <div className="w-3 h-3 rounded-full bg-primary-600"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button 
                onClick={() => navigate('/dashboard')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleProceedToVerification}
                className="btn btn-primary"
                disabled={!selectedCandidate}
              >
                Proceed to Verification
              </button>
            </div>
          </>
        )}

        {verificationStep === 'verify' && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Identity</h1>
              <p className="text-gray-600">
                To prevent duplicate voting and ensure your vote is secure, 
                please complete these verification steps
              </p>
            </div>

            <DuplicateVoteAlert
              type="warning"
              title="Anti-Fraud Measures Active"
              message="Our system compares your biometric data with your previous registration to prevent voter impersonation and duplicate voting."
            />

            <div className="space-y-8 mb-8">
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Fingerprint className="h-5 w-5 text-primary-600" />
                  <span>Fingerprint Verification</span>
                </h3>
                {!fingerprintVerified ? (
                  <>
                    <p className="text-gray-600 mb-4">
                      Place your finger on the fingerprint scanner to verify your identity
                    </p>
                    <button 
                      onClick={simulateFingerprintVerification}
                      className="btn btn-primary"
                    >
                      Scan Fingerprint
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-3 text-green-700 bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                    <span>Fingerprint verified successfully ({fingerprintMatchPercentage}% match)</span>
                  </div>
                )}
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary-600" />
                  <span>Facial Recognition</span>
                </h3>
                {!faceVerified ? (
                  <>
                    <p className="text-gray-600 mb-4">
                      Look at the camera for facial recognition verification
                    </p>
                    <button 
                      onClick={simulateFaceVerification}
                      className="btn btn-primary"
                      disabled={!fingerprintVerified}
                    >
                      Start Facial Scan
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-3 text-green-700 bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                    <span>Face recognized successfully ({faceMatchPercentage}% match)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <button 
                onClick={() => setVerificationStep('selection')}
                className="btn btn-secondary"
              >
                Back
              </button>
              <button 
                onClick={handleCastVote}
                className="btn btn-primary"
                disabled={!fingerprintVerified || !faceVerified}
              >
                Cast Vote
              </button>
            </div>
          </>
        )}

        {verificationStep === 'success' && votingComplete && (
          <div className="text-center py-8">
            <div className="bg-green-100 rounded-full p-6 inline-flex mb-8">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vote Cast Successfully!</h2>
            <p className="text-gray-600 text-lg mb-8">
              Your vote has been securely recorded. Thank you for participating in the democratic process.
            </p>
            <div className="bg-gray-50 rounded-lg p-6 max-w-sm mx-auto mb-8">
              <p className="text-gray-500 text-sm mb-1">Vote Receipt Number</p>
              <p className="font-mono font-medium text-gray-800 text-lg">{voteReceipt}</p>
              <p className="text-xs text-gray-500 mt-2">
                This receipt can be used to verify your vote was counted without revealing your choice.
              </p>
            </div>
            <button onClick={handleFinish} className="btn btn-primary px-8">
              Return to Dashboard
            </button>
          </div>
        )}
      </div>

      {/* Biometric modals */}
      <BiometricVerificationModal
        isOpen={showFingerprintModal}
        onClose={() => setShowFingerprintModal(false)}
        onVerificationComplete={handleFingerprintVerificationComplete}
        verificationType="fingerprint"
        title="Fingerprint Verification"
        description="Please place your finger on the scanner"
      />
      
      <BiometricVerificationModal
        isOpen={showFacialModal}
        onClose={() => setShowFacialModal(false)}
        onVerificationComplete={handleFaceVerificationComplete}
        verificationType="facial"
        title="Facial Recognition"
        description="Please look directly at the camera"
      />
      
      {/* Duplicate vote modal */}
      {showDuplicateModal && duplicateInfo && (
        <DuplicateVoteDetected
          originalTimestamp={duplicateInfo.timestamp}
          electionTitle={duplicateInfo.electionTitle}
          onDismiss={() => {
            setShowDuplicateModal(false);
            navigate('/dashboard');
          }}
        />
      )}
      
      <div className="mt-12 bg-gray-50 border rounded-lg p-6 max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <img 
            src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxiaW9tZXRyaWMlMjBmaW5nZXJwcmludCUyMHNjYW4lMjB0ZWNobm9sb2d5fGVufDB8fHx8MTc0NTU2OTQyMnww&ixlib=rb-4.0.3&fit=fillmax&h=80&w=80"
            alt="Biometric scanning technology"
            className="h-10 w-10 rounded-full object-cover mr-2"
          />
          <span>Secure Biometric Verification</span>
        </h3>
        <p className="text-gray-700 mb-4">
          Our advanced biometric verification system ensures that each voter is accurately identified and can only vote once per election. This helps prevent fraud and protects the integrity of the democratic process.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
            <span>Prevents duplicate voting through fingerprint and facial recognition</span>
          </div>
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
            <span>Biometric data encrypted and securely stored</span>
          </div>
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
            <span>Compliant with international privacy standards</span>
          </div>
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
            <span>Real-time detection of impersonation attempts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CastVote;
 