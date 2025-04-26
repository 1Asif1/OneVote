import  { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import VotingABI from './VotingABI.json';
import { Shield, Vote, AlertTriangle, Wallet, Check, Info, ExternalLink, RefreshCw } from 'lucide-react';
import VoteResultModal from './components/VoteResultModal';


// Contract address on the blockchain
const contractAddress = "0x97343ddc92fae80a13195cf4589ea11cc5b6c6f0";

// Candidate data
const candidates = [
  {
    id: 1,
    name: "Candidate 1",
    party: "Party 1",
    image: "https://images.unsplash.com/photo-1484981138541-3d074aa97716?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjYW5kaWRhdGUlMjBwb3J0cmFpdHN8ZW58MHx8fHwxNzQ1NjAyMTAwfDA&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200",
    description: "Focused on education reform and environmental policy."
  },
  {
    id: 2,
    name: "Candidate 2",
    party: "Party 2",
    image: "https://images.unsplash.com/photo-1425421669292-0c3da3b8f529?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjBjYW5kaWRhdGUlMjBwb3J0cmFpdHN8ZW58MHx8fHwxNzQ1NjAyMTAwfDA&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200",
    description: "Advocating for economic growth and healthcare access for all."
  },
  {
    id: 3,
    name: "Candidate 3",
    party: "Party 3",
    image: "https://images.unsplash.com/photo-1496180470114-6ef490f3ff22?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjBjYW5kaWRhdGUlMjBwb3J0cmFpdHN8ZW58MHx8fHwxNzQ1NjAyMTAwfDA&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200",
    description: "Committed to social justice and community development."
  }
];

function App() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [statusType, setStatusType] = useState<'success' | 'error' | 'info' | null>(null);
  const [voteCounts, setVoteCounts] = useState<Record<number, number>>({});
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [isVoting, setIsVoting] = useState<boolean>(false);
  const [isLoadingVotes, setIsLoadingVotes] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedCandidateForModal, setSelectedCandidateForModal] = useState<number | null>(null);

  // Connect to the Ethereum wallet (Metamask)
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setIsConnecting(true);
        setStatus('Connecting to wallet...');
        setStatusType('info');
        
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        
        setAccount(userAddress);
        
        const contract = new ethers.Contract(contractAddress, VotingABI, signer);
        setProvider(provider);
        setContract(contract);
        
        // Check if the user has already voted
        const voted = await contract.hasVoted(userAddress);
        setHasVoted(voted);
        
        setStatus(`Successfully connected to wallet ${userAddress.substring(0, 6)}...${userAddress.substring(userAddress.length - 4)}`);
        setStatusType('success');
        
        // Fetch initial vote counts
        fetchAllVotes();
      } catch (error) {
        console.error("Error connecting to wallet", error);
        setStatus('Failed to connect wallet. Please make sure MetaMask is installed and unlocked.');
        setStatusType('error');
      } finally {
        setIsConnecting(false);
      }
    } else {
      setStatus('Please install MetaMask to use this application');
      setStatusType('error');
    }
  };

  // Cast a vote for the selected candidate
  const vote = async () => {
    if (!contract || !selectedCandidate) return;
    
    try {
      setIsVoting(true);
      setStatus(`Casting your vote for ${candidates.find(c => c.id === selectedCandidate)?.name}...`);
      setStatusType('info');
      
      const tx = await contract.vote(selectedCandidate);
      await tx.wait();
      
      setHasVoted(true);
      setStatus(`Vote cast successfully for ${candidates.find(c => c.id === selectedCandidate)?.name}!`);
      setStatusType('success');
      
      // Refresh vote counts
      fetchAllVotes();
    } catch (err: any) {
      const message = err?.error?.message || err?.message || "An unknown error occurred";
      const cleanMessage = message.includes("You have already voted")
        ? "You have already voted in this election. Each voter can only vote once to ensure electoral integrity."
        : message;
      
      setStatus(cleanMessage);
      setStatusType('error');
    } finally {
      setIsVoting(false);
    }
  };

  // Vote for specific candidate (from original code)
  const voteForCandidate = async (candidateId: number) => {
    try {
      setIsVoting(true);
      setStatus(`Casting your vote for ${candidates.find(c => c.id === candidateId)?.name}...`);
      setStatusType('info');
      
      const tx = await contract?.vote(candidateId);
      await tx?.wait();
      
      setHasVoted(true);
      setStatus(`Vote cast successfully for ${candidates.find(c => c.id === candidateId)?.name}!`);
      setStatusType('success');
      
      // Refresh vote counts
      fetchAllVotes();
    } catch (err: any) {
      const message = err?.error?.message || err?.message || "An unknown error occurred";
      const cleanMessage = message.includes("You have already voted")
        ? "execution reverted: You have already voted."
        : message;
      
      setStatus(`Status: ${cleanMessage}`);
      setStatusType('error');
    } finally {
      setIsVoting(false);
    }
  };

  // Fetch votes for a specific candidate
  const fetchVotes = async (candidateId: number) => {
    if (!contract) return 0;
    
    try {
      const count = await contract.getVotes(candidateId);
      return parseInt(count.toString());
    } catch (error) {
      console.error(`Error fetching votes for candidate ${candidateId}`, error);
      return 0;
    }
  };

  // Fetch votes for all candidates
  const fetchAllVotes = async () => {
    if (!contract) return;
    
    try {
      setIsLoadingVotes(true);
      const newVoteCounts: Record<number, number> = {};
      
      for (const candidate of candidates) {
        newVoteCounts[candidate.id] = await fetchVotes(candidate.id);
      }
      
      setVoteCounts(newVoteCounts);
    } catch (error) {
      console.error("Error fetching all votes", error);
    } finally {
      setIsLoadingVotes(false);
    }
  };

  // Handle showing individual candidate results
  const showCandidateResults = async (candidateId: number) => {
    try {
      // Refresh this candidate's votes first
      const count = await fetchVotes(candidateId);
      setVoteCounts(prev => ({...prev, [candidateId]: count}));
      
      // Set the selected candidate for the modal
      setSelectedCandidateForModal(candidateId);
      setModalOpen(true);
    } catch (error) {
      console.error("Error displaying candidate results", error);
    }
  };

  // Calculate total votes and percentages
  const totalVotes = Object.values(voteCounts).reduce((sum, count) => sum + count, 0);
  
  const getVotePercentage = (candidateId: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((voteCounts[candidateId] || 0) / totalVotes * 100);
  };

  // Handle account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          // Reset state when user changes account
          setHasVoted(false);
          setSelectedCandidate(null);
          // Reconnect to check voting status of the new account
          connectWallet();
        } else {
          setAccount('');
          setProvider(null);
          setContract(null);
        }
      });
    }
    
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  // Get selected candidate details for modal
  const getSelectedCandidateDetails = () => {
    if (!selectedCandidateForModal) return null;
    const candidate = candidates.find(c => c.id === selectedCandidateForModal);
    if (!candidate) return null;
    
    return {
      id: candidate.id,
      name: candidate.name,
      party: candidate.party,
      image: candidate.image,
      votes: voteCounts[candidate.id] || 0
    };
  };

  const candidateDetails = getSelectedCandidateDetails();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary-600" />
              <span className="font-bold text-2xl text-primary-800">OneVote</span>
            </div>
            
            {account ? (
              <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                <Wallet className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-medium">
                  {account.substring(0, 6)}...{account.substring(account.length - 4)}
                </span>
              </div>
            ) : (
              <button 
                onClick={connectWallet}
                disabled={isConnecting}
                className="btn btn-primary flex items-center gap-2"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4" />
                    <span>Connect Wallet</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Status message */}
        {status && (
          <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
            statusType === 'success' ? 'bg-green-50 border border-green-200' :
            statusType === 'error' ? 'bg-red-50 border border-red-200' :
            'bg-primary-50 border border-primary-200'
          }`}>
            {statusType === 'success' && <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />}
            {statusType === 'error' && <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />}
            {statusType === 'info' && <Info className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />}
            <div>
              <p className={`font-medium ${
                statusType === 'success' ? 'text-green-800' :
                statusType === 'error' ? 'text-red-800' :
                'text-primary-800'
              }`}>
                {statusType === 'success' ? 'Success' : 
                 statusType === 'error' ? 'Error' : 'Information'}
              </p>
              <p className={
                statusType === 'success' ? 'text-green-700' :
                statusType === 'error' ? 'text-red-700' :
                'text-primary-700'
              }>
                {status}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main voting section */}
          <div className="md:col-span-2 space-y-6">
            <div className="card">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Presidential Election 2023</h1>
              <p className="text-gray-600 mb-6">
                Cast your vote securely using blockchain technology. Your vote is anonymous, immutable, and verifiable. Each voter can cast only one vote, enforced by smart contracts.
              </p>

              {!account ? (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-primary-800">Connect Your Ethereum Wallet</p>
                    <p className="text-primary-700">
                      To participate in this election, please connect your Ethereum wallet. This ensures your vote is securely registered on the blockchain.
                    </p>
                  </div>
                </div>
              ) : hasVoted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">You Have Voted</p>
                    <p className="text-green-700">
                      Thank you for participating in this election. Your vote has been securely recorded on the blockchain. You can view the results in real-time.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold mb-2">Select Your Candidate</h2>
                  {candidates.map((candidate) => (
                    <div 
                      key={candidate.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedCandidate === candidate.id 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedCandidate(candidate.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          <img src={candidate.image} alt={candidate.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold">{candidate.name}</h3>
                          <p className="text-gray-500 text-sm">{candidate.party}</p>
                          <p className="text-gray-600 text-sm">{candidate.description}</p>
                        </div>
                        <div className="w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center">
                          {selectedCandidate === candidate.id && (
                            <div className="w-3 h-3 rounded-full bg-primary-600"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    onClick={vote}
                    disabled={!selectedCandidate || isVoting}
                    className={`btn w-full flex items-center justify-center gap-2 ${
                      !selectedCandidate
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'btn-primary'
                    }`}
                  >
                    {isVoting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Processing Vote...</span>
                      </>
                    ) : (
                      <>
                        <Vote className="h-4 w-4" />
                        <span>Cast Your Vote</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Direct Vote Buttons (from original code) */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Quick Vote Buttons</h2>
              <p className="text-sm text-gray-600 mb-4">
                You can also vote directly for a candidate using these buttons:
              </p>
              <div className="flex flex-wrap gap-3">
                {candidates.map((candidate) => (
                  <button 
                    key={candidate.id}
                    onClick={() => voteForCandidate(candidate.id)}
                    disabled={!account || hasVoted || isVoting}
                    className={`btn flex-grow ${hasVoted || !account ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'btn-primary'}`}
                  >
                    Vote {candidate.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results section */}
          <div className="space-y-6">
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Live Results</h2>
                <button 
                  onClick={fetchAllVotes}
                  disabled={isLoadingVotes}
                  className="text-primary-600 flex items-center gap-1 text-sm"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoadingVotes ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="space-y-4">
                {candidates.map((candidate) => (
                  <div key={candidate.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200">
                          <img src={candidate.image} alt={candidate.name} className="h-full w-full object-cover" />
                        </div>
                        <span className="font-medium">{candidate.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">{voteCounts[candidate.id] || 0}</span>
                        <span className="text-gray-500 text-sm ml-1">({getVotePercentage(candidate.id)}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-primary-600 h-2.5 rounded-full" 
                        style={{ width: `${getVotePercentage(candidate.id)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}

                <div className="pt-2 border-t text-sm text-gray-500 flex justify-between">
                  <span>Total Votes:</span>
                  <span className="font-medium">{totalVotes}</span>
                </div>
              </div>
            </div>

            {/* Get Votes Buttons (from original code) */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Check Individual Results</h2>
              <div className="space-y-3">
                {candidates.map((candidate) => (
                  <button 
                    key={candidate.id}
                    onClick={() => showCandidateResults(candidate.id)}
                    className="btn btn-secondary w-full"
                  >
                    Get Votes for {candidate.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Blockchain Security</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-primary-600 mt-0.5" />
                  <span>Your vote is secured by Ethereum blockchain technology</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-primary-600 mt-0.5" />
                  <span>Smart contracts prevent double voting</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary-600 mt-0.5" />
                  <span>Each vote is permanent and cannot be altered</span>
                </div>
                
                <a 
                  href={`https://etherscan.io/address/${contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary-600 hover:underline mt-2"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>View contract on Etherscan</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Info section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Vote className="h-5 w-5 text-primary-600" />
              <span>How Blockchain Voting Works</span>
            </h2>
            <p className="text-gray-600 mb-4">
              Our blockchain voting system leverages Ethereum smart contracts to ensure a secure, transparent, and tamper-proof election. Each vote is recorded as a transaction on the Ethereum blockchain.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 bg-primary-600 text-white h-5 w-5 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                  1
                </div>
                <p className="text-gray-700">Connect your Ethereum wallet (MetaMask)</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 bg-primary-600 text-white h-5 w-5 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                  2
                </div>
                <p className="text-gray-700">Select your preferred candidate</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 bg-primary-600 text-white h-5 w-5 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                  3
                </div>
                <p className="text-gray-700">Confirm your transaction in your wallet</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 bg-primary-600 text-white h-5 w-5 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                  4
                </div>
                <p className="text-gray-700">Your vote is permanently recorded on the blockchain</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary-600" />
              <span>Security & SDG 16 Alignment</span>
            </h2>
            <p className="text-gray-600 mb-4">
              This system supports UN Sustainable Development Goal 16 by promoting peaceful and inclusive societies through secure, accountable, and transparent electoral processes.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">Prevents duplicate voting through cryptographic validation</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">Immutable record of all votes ensures election integrity</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">Transparent results available in real-time</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">Reduces fraud and strengthens democratic institutions</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-primary-400" />
              <span className="font-bold text-xl text-white">OneVote</span>
            </div>
            <p className="text-gray-400 text-center md:text-right">
              Built for SDG 16: Peace, Justice, and Strong Institutions<br />
              © {new Date().getFullYear()} EliteSquad. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Candidate Results Modal */}
      {candidateDetails && (
        <VoteResultModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          candidateId={candidateDetails.id}
          candidateName={candidateDetails.name}
          candidateParty={candidateDetails.party}
          candidateImage={candidateDetails.image}
          votes={candidateDetails.votes}
          totalVotes={totalVotes}
        />
      )}
    </div>
  );
}

export default App;
 