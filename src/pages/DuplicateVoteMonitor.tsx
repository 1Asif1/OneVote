import  { useState } from 'react';
import { useVote } from '../context/VoteContext';
import { Shield, AlertTriangle, Users, Clock, ChevronDown, ChevronUp, Map } from 'lucide-react';
import { DuplicateVote } from '../types';

const DuplicateVoteMonitor = () => {
  const { duplicateVotes, getDuplicateVoteStats } = useVote();
  const [expandedVote, setExpandedVote] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'confirmed' | 'potential'>('all');
  
  const stats = getDuplicateVoteStats();
  
  const toggleExpandVote = (id: string) => {
    if (expandedVote === id) {
      setExpandedVote(null);
    } else {
      setExpandedVote(id);
    }
  };
  
  // Filter votes based on selected filter
  const filteredVotes = duplicateVotes.filter(vote => {
    if (filterType === 'all') return true;
    if (filterType === 'confirmed') return vote.fingerprintMatch && vote.facialMatch;
    if (filterType === 'potential') return !vote.fingerprintMatch || !vote.facialMatch;
    return true;
  });
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto card">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Duplicate Vote Monitoring</h1>
            <p className="text-gray-600">
              Track and analyze duplicate voting attempts to ensure electoral integrity
            </p>
          </div>
          <div className="bg-primary-600 text-white p-3 rounded-lg">
            <Shield className="h-6 w-6" />
          </div>
        </div>
        
        {/* Stats summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-red-50 border border-red-100 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-red-800">Total Attempts</h3>
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">duplicate vote attempts detected</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-yellow-800">Last 24 Hours</h3>
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.lastDay}</p>
            <p className="text-sm text-gray-600">recent duplicate attempts</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-blue-800">Last 7 Days</h3>
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.lastWeek}</p>
            <p className="text-sm text-gray-600">attempts in the past week</p>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            className={`px-4 py-2 rounded-lg ${
              filterType === 'all' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFilterType('all')}
          >
            All Attempts
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              filterType === 'confirmed' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFilterType('confirmed')}
          >
            Confirmed Duplicates
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              filterType === 'potential' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setFilterType('potential')}
          >
            Potential Duplicates
          </button>
        </div>
        
        {/* Duplicate vote list */}
        {filteredVotes.length > 0 ? (
          <div className="space-y-4">
            {filteredVotes.map((vote: DuplicateVote) => (
              <div 
                key={vote.id} 
                className="border rounded-lg overflow-hidden"
              >
                <div 
                  className="p-4 bg-gray-50 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleExpandVote(vote.id)}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">Voter ID: {vote.voterId}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        vote.fingerprintMatch && vote.facialMatch
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {vote.fingerprintMatch && vote.facialMatch ? 'Confirmed' : 'Potential'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Attempt on {formatDate(vote.duplicateAttemptTimestamp)}
                    </p>
                  </div>
                  <div>
                    {expandedVote === vote.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                
                {expandedVote === vote.id && (
                  <div className="p-4 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Original Vote</h4>
                        <p className="text-gray-900">{formatDate(vote.originalVoteTimestamp)}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Duplicate Attempt</h4>
                        <p className="text-gray-900">{formatDate(vote.duplicateAttemptTimestamp)}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Fingerprint Match</h4>
                        <div className={`flex items-center ${vote.fingerprintMatch ? 'text-red-600' : 'text-green-600'}`}>
                          {vote.fingerprintMatch ? (
                            <AlertTriangle className="h-4 w-4 mr-1" />
                          ) : (
                            <Shield className="h-4 w-4 mr-1" />
                          )}
                          <span>{vote.fingerprintMatch ? 'Matched' : 'Different'}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Facial Recognition</h4>
                        <div className={`flex items-center ${vote.facialMatch ? 'text-red-600' : 'text-green-600'}`}>
                          {vote.facialMatch ? (
                            <AlertTriangle className="h-4 w-4 mr-1" />
                          ) : (
                            <Shield className="h-4 w-4 mr-1" />
                          )}
                          <span>{vote.facialMatch ? 'Matched' : 'Different'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">IP Address</h4>
                        <div className="flex items-center">
                          <Map className="h-4 w-4 mr-1 text-gray-400" />
                          <span>{vote.ipAddress}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Device Info</h4>
                        <p className="text-gray-900">{vote.deviceInfo}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Analysis</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {vote.fingerprintMatch && vote.facialMatch 
                          ? "High confidence duplicate vote. Same voter attempted to vote twice in the same election. Original vote remains valid, duplicate attempt was rejected."
                          : vote.fingerprintMatch || vote.facialMatch
                            ? "Moderate confidence duplicate detection. Some biometric markers matched, but others did not. This could indicate a technical issue or a sophisticated attempt to vote twice."
                            : "Low confidence duplicate detection. Voter ID matched a previous vote, but biometric data did not match. This may indicate a system error or potential identity theft."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <div className="bg-gray-100 inline-flex rounded-full p-3 mb-4">
              <Shield className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No duplicate vote attempts found</h3>
            <p className="text-gray-500">
              {filterType === 'all' 
                ? "There are no duplicate vote attempts in the system." 
                : `No ${filterType} duplicate votes found. Try a different filter.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DuplicateVoteMonitor;
 