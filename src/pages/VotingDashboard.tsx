import  { useState } from 'react';
import { Link } from 'react-router-dom';
import { Vote, Clipboard, AlertCircle, Clock, CheckCircle, User, Shield, AlertTriangle } from 'lucide-react';
import { elections } from '../data/mockData';
import { useVote } from '../context/VoteContext';

const VotingDashboard = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const { currentUser, voteRecords, duplicateVotes } = useVote();
  
  const activeElections = elections.filter(e => e.status === 'active');
  const upcomingElections = elections.filter(e => e.status === 'upcoming');
  const completedElections = elections.filter(e => e.status === 'completed');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <div className="card mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary-100 p-3 rounded-full">
                <User className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{currentUser.name}</h3>
                <p className="text-gray-500 text-sm">{currentUser.email}</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Voter ID:</span>
                <span className="font-medium">{currentUser.voterId}</span>
              </p>
              <p className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Registered:</span>
                <span>{currentUser.registrationDate}</span>
              </p>
              <p className="flex justify-between text-sm">
                <span className="text-gray-600">Voting Status:</span>
                <span className={`font-medium ${currentUser.hasVoted ? 'text-green-600' : 'text-blue-600'}`}>
                  {currentUser.hasVoted ? 'Voted' : 'Not Voted'}
                </span>
              </p>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/vote" className="btn btn-primary w-full flex items-center justify-center gap-2">
                <Vote className="h-4 w-4" />
                <span>Cast Vote</span>
              </Link>
              <Link to="/results" className="btn btn-secondary w-full flex items-center justify-center gap-2">
                <Clipboard className="h-4 w-4" />
                <span>View Results</span>
              </Link>
              
              {/* Security Status */}
              <div className="border rounded-lg p-4 mt-4">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary-600" />
                  <span>Security Overview</span>
                </h4>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Your votes:</span>
                    <span className="font-medium">{voteRecords.length}</span>
                  </div>
                  
                  {duplicateVotes.length > 0 ? (
                    <div className="flex justify-between text-red-600">
                      <span className="flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Duplicate attempts:
                      </span>
                      <Link to="/duplicate-monitor" className="font-medium underline">
                        {duplicateVotes.length} detected
                      </Link>
                    </div>
                  ) : (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Duplicate attempts:
                      </span>
                      <span className="font-medium">None detected</span>
                    </div>
                  )}
                  
                  <Link to="/duplicate-monitor" className="btn btn-secondary w-full text-xs flex items-center justify-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span>View Fraud Monitor</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          <div className="card">
            <h1 className="text-2xl font-bold mb-6">Your Voting Dashboard</h1>

            {/* Alert */}
            {activeElections.length > 0 && !currentUser.hasVoted && (
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-primary-800">Active Election Available</p>
                  <p className="text-primary-700">
                    There is an active election you're eligible to vote in. Cast your vote before the deadline.
                  </p>
                </div>
              </div>
            )}
            
            {/* Anti-Fraud Alert */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <Shield className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Anti-Fraud System Active</p>
                <p className="text-yellow-700">
                  Our biometric verification system prevents duplicate voting. Any attempt to vote more than once 
                  in the same election will be detected and blocked.
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b mb-6">
              <div className="flex space-x-8">
                <button
                  className={`pb-4 ${
                    activeTab === 'upcoming'
                      ? 'border-b-2 border-primary-600 text-primary-600 font-medium'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('upcoming')}
                >
                  Upcoming
                </button>
                <button
                  className={`pb-4 ${
                    activeTab === 'active'
                      ? 'border-b-2 border-primary-600 text-primary-600 font-medium'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('active')}
                >
                  Active
                </button>
                <button
                  className={`pb-4 ${
                    activeTab === 'past'
                      ? 'border-b-2 border-primary-600 text-primary-600 font-medium'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('past')}
                >
                  Past
                </button>
              </div>
            </div>

            {/* Elections List */}
            <div className="space-y-6">
              {activeTab === 'active' && (
                activeElections.length > 0 ? (
                  activeElections.map((election) => (
                    <div key={election.id} className="border rounded-lg p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg">{election.title}</h3>
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Active
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{election.description}</p>
                      <div className="flex justify-between text-sm text-gray-500 mb-6">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Ends: {election.endDate}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{election.candidates.length} Candidates</span>
                        </span>
                      </div>

                      <Link 
                        to="/vote" 
                        className={`btn w-full flex items-center justify-center gap-2 ${
                          currentUser.hasVoted ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'btn-primary'
                        }`}
                        onClick={e => currentUser.hasVoted && e.preventDefault()}
                      >
                        {currentUser.hasVoted ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            <span>Already Voted</span>
                          </>
                        ) : (
                          <>
                            <Vote className="h-4 w-4" />
                            <span>Cast Your Vote</span>
                          </>
                        )}
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Active Elections</h3>
                    <p className="text-gray-500">There are no active elections at the moment. Check back later.</p>
                  </div>
                )
              )}

              {activeTab === 'upcoming' && (
                upcomingElections.length > 0 ? (
                  upcomingElections.map((election) => (
                    <div key={election.id} className="border rounded-lg p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg">{election.title}</h3>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Upcoming
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{election.description}</p>
                      <div className="flex justify-between text-sm text-gray-500 mb-6">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Starts: {election.startDate}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{election.candidates.length} Candidates</span>
                        </span>
                      </div>

                      <button disabled className="btn bg-gray-100 text-gray-500 cursor-not-allowed w-full flex items-center justify-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Coming Soon</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Upcoming Elections</h3>
                    <p className="text-gray-500">There are no upcoming elections scheduled at the moment.</p>
                  </div>
                )
              )}

              {activeTab === 'past' && (
                completedElections.length > 0 ? (
                  completedElections.map((election) => (
                    <div key={election.id} className="border rounded-lg p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg">{election.title}</h3>
                        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Completed
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{election.description}</p>
                      <div className="flex justify-between text-sm text-gray-500 mb-6">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          <span>Ended: {election.endDate}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{election.candidates.length} Candidates</span>
                        </span>
                      </div>

                      <Link to="/results" className="btn btn-secondary w-full flex items-center justify-center gap-2">
                        <Clipboard className="h-4 w-4" />
                        <span>View Results</span>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clipboard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Past Elections</h3>
                    <p className="text-gray-500">There are no completed elections in your history.</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingDashboard;
 