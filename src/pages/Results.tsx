import  { useState } from 'react';
import { elections } from '../data/mockData';
import { Clipboard, ChevronDown, ChevronUp, User, Award } from 'lucide-react';

const Results = () => {
  const [expandedElectionId, setExpandedElectionId] = useState<string | null>('1');

  const toggleExpandElection = (id: string) => {
    if (expandedElectionId === id) {
      setExpandedElectionId(null);
    } else {
      setExpandedElectionId(id);
    }
  };

  const getTotalVotes = (electionId: string) => {
    const election = elections.find(e => e.id === electionId);
    if (election) {
      return election.candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
    }
    return 0;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto card">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Election Results</h1>
          <p className="text-gray-600">
            View transparent results from all elections. Results are updated in real-time 
            and can be independently verified.
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {elections.map((election) => {
            const totalVotes = getTotalVotes(election.id);
            const sortedCandidates = [...election.candidates].sort((a, b) => b.votes - a.votes);
            const winner = sortedCandidates[0];
            
            return (
              <div key={election.id} className="border rounded-lg overflow-hidden">
                <div 
                  className="bg-gray-50 p-4 flex justify-between items-center cursor-pointer"
                  onClick={() => toggleExpandElection(election.id)}
                >
                  <div>
                    <h3 className="font-semibold text-lg">{election.title}</h3>
                    <p className="text-gray-500 text-sm">
                      {election.status === 'completed' 
                        ? `Ended: ${election.endDate}` 
                        : election.status === 'active'
                          ? `Ends: ${election.endDate}`
                          : `Starts: ${election.startDate}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm px-2.5 py-0.5 rounded ${
                      election.status === 'completed' 
                        ? 'bg-gray-100 text-gray-800' 
                        : election.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                    </span>
                    {expandedElectionId === election.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>

                {expandedElectionId === election.id && (
                  <div className="p-6">
                    {election.status === 'completed' && (
                      <div className="mb-8 flex flex-col sm:flex-row gap-6 items-center p-4 bg-primary-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <div className="h-24 w-24 rounded-full overflow-hidden">
                              <img src={winner.image} alt={winner.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="absolute -right-2 -bottom-2 bg-yellow-400 p-2 rounded-full">
                              <Award className="h-5 w-5 text-white" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-primary-600 font-medium mb-1">Winner</div>
                          <h4 className="text-xl font-bold text-gray-900 mb-1">{winner.name}</h4>
                          <p className="text-gray-600 mb-2">{winner.party}</p>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-primary-700">{winner.votes} votes</span>
                            <span className="text-gray-500">({Math.round((winner.votes / totalVotes) * 100)}%)</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-1">All Candidates</h4>
                      <p className="text-sm text-gray-500">
                        {election.status === 'completed' || election.status === 'active' 
                          ? `Total votes cast: ${totalVotes}` 
                          : 'Voting has not started yet'}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {sortedCandidates.map((candidate, index) => (
                        <div key={candidate.id} className="p-4 border rounded-lg">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                              <img src={candidate.image} alt={candidate.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{candidate.name}</h4>
                                {index === 0 && election.status === 'completed' && (
                                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">
                                    Winner
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-500 text-sm">{candidate.party}</p>
                            </div>
                            {(election.status === 'completed' || election.status === 'active') && (
                              <div className="text-right">
                                <div className="text-lg font-medium">{candidate.votes}</div>
                                <div className="text-sm text-gray-500">
                                  {Math.round((candidate.votes / totalVotes) * 100)}%
                                </div>
                              </div>
                            )}
                          </div>

                          {(election.status === 'completed' || election.status === 'active') && (
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-primary-600 h-2.5 rounded-full" 
                                style={{ 
                                  width: `${Math.round((candidate.votes / totalVotes) * 100)}%` 
                                }}
                              ></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {(election.status === 'completed' || election.status === 'active') && (
                      <div className="mt-6 text-center">
                        <button className="btn btn-secondary flex items-center gap-2 mx-auto">
                          <Clipboard className="h-4 w-4" />
                          <span>Download Detailed Results</span>
                        </button>
                      </div>
                    )}
                    
                    {election.status === 'upcoming' && (
                      <div className="text-center py-4">
                        <User className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">
                          Voting has not started yet. Come back on {election.startDate} to see results.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">About Election Results</h3>
          <p className="text-sm text-gray-600 mb-4">
            Our election system uses blockchain technology to ensure votes cannot be tampered with. 
            All results are cryptographically verified and can be independently audited.
          </p>
          <p className="text-sm text-gray-600">
            <strong>Verification:</strong> Each vote generates a unique receipt that voters can use to 
            verify their vote was counted correctly without revealing their choice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Results;
 