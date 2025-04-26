export  interface User {
  id: string;
  name: string;
  email: string;
  voterId: string;
  hasVoted: boolean;
  registrationDate: string;
  voteRecord?: VoteRecord;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  position: string;
  votes: number;
  image: string;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  candidates: Candidate[];
}

export interface VoteRecord {
  electionId: string;
  candidateId: string;
  timestamp: string;
  receiptNumber: string;
  fingerprint: string;
  facialSignature: string;
}

export interface DuplicateVote {
  id: string;
  voterId: string;
  electionId: string;
  originalVoteTimestamp: string;
  duplicateAttemptTimestamp: string;
  fingerprintMatch: boolean;
  facialMatch: boolean;
  ipAddress: string;
  deviceInfo: string;
}
 