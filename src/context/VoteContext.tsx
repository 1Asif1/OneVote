import  { createContext, useContext, useState, ReactNode } from 'react';
import { VoteRecord, DuplicateVote, User } from '../types';
import { currentUser as mockUser } from '../data/mockData';

interface VoteContextType {
  currentUser: User;
  voteRecords: VoteRecord[];
  duplicateVotes: DuplicateVote[];
  registerVote: (electionId: string, candidateId: string) => Promise<{ success: boolean; message: string; receiptNumber?: string }>;
  checkDuplicateVote: (electionId: string, voterId: string) => Promise<{ isDuplicate: boolean; originalVote?: VoteRecord }>;
  flagDuplicateVote: (originalVote: VoteRecord, fingerprint: string, facialSignature: string) => void;
  getDuplicateVoteStats: () => { total: number; lastDay: number; lastWeek: number };
}

const VoteContext = createContext<VoteContextType | undefined>(undefined);

export const VoteProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>(mockUser);
  const [voteRecords, setVoteRecords] = useState<VoteRecord[]>([]);
  const [duplicateVotes, setDuplicateVotes] = useState<DuplicateVote[]>([]);

  // Generate a unique receipt number
  const generateReceiptNumber = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = 'VT-';
    for (let i = 0; i < 12; i++) {
      if (i === 4 || i === 8) result += '-';
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  };

  // Check if the voter has already voted in this election
  const checkDuplicateVote = async (
    electionId: string, 
    voterId: string
  ): Promise<{ isDuplicate: boolean; originalVote?: VoteRecord }> => {
    // In a real app, this would be an API call with proper authentication
    const existingVote = voteRecords.find(
      record => record.electionId === electionId && currentUser.voterId === voterId
    );
    
    return {
      isDuplicate: !!existingVote,
      originalVote: existingVote
    };
  };

  // Register a new vote
  const registerVote = async (
    electionId: string, 
    candidateId: string
  ): Promise<{ success: boolean; message: string; receiptNumber?: string }> => {
    // Check for duplicate votes
    const { isDuplicate, originalVote } = await checkDuplicateVote(electionId, currentUser.voterId);
    
    if (isDuplicate && originalVote) {
      // Generate dummy biometric data for simulation
      const fingerprintData = Math.random().toString(36).substring(2);
      const facialData = Math.random().toString(36).substring(2);
      
      // Flag this as a duplicate vote attempt
      flagDuplicateVote(originalVote, fingerprintData, facialData);
      
      return {
        success: false,
        message: "Duplicate vote detected. Your original vote for this election remains valid."
      };
    }
    
    // In a real app, this would be a secure API call to record the vote
    const receiptNumber = generateReceiptNumber();
    
    // Generate biometric data for the vote record
    const fingerprintSignature = Math.random().toString(36).substring(2);
    const facialSignature = Math.random().toString(36).substring(2);
    
    const newVoteRecord: VoteRecord = {
      electionId,
      candidateId,
      timestamp: new Date().toISOString(),
      receiptNumber,
      fingerprint: fingerprintSignature,
      facialSignature: facialSignature
    };
    
    // Update state with new vote record
    setVoteRecords([...voteRecords, newVoteRecord]);
    
    // Update user's voting status
    setCurrentUser({
      ...currentUser,
      hasVoted: true,
      voteRecord: newVoteRecord
    });
    
    return {
      success: true,
      message: "Vote successfully recorded",
      receiptNumber
    };
  };

  // Flag a duplicate vote attempt for audit and security monitoring
  const flagDuplicateVote = (originalVote: VoteRecord, fingerprint: string, facialSignature: string) => {
    const newDuplicateVote: DuplicateVote = {
      id: `dup-${Date.now()}`,
      voterId: currentUser.voterId,
      electionId: originalVote.electionId,
      originalVoteTimestamp: originalVote.timestamp,
      duplicateAttemptTimestamp: new Date().toISOString(),
      fingerprintMatch: Math.random() > 0.3, // Simulate biometric matching (70% match probability)
      facialMatch: Math.random() > 0.3, // Simulate biometric matching (70% match probability)
      ipAddress: "192.168.1." + Math.floor(Math.random() * 255), // Simulated IP
      deviceInfo: "Browser: Chrome, OS: " + (Math.random() > 0.5 ? "Windows" : "macOS") // Simulated device info
    };
    
    setDuplicateVotes([...duplicateVotes, newDuplicateVote]);
  };

  // Get statistics about duplicate vote attempts
  const getDuplicateVoteStats = () => {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const lastDay = duplicateVotes.filter(
      dv => new Date(dv.duplicateAttemptTimestamp) >= oneDayAgo
    ).length;
    
    const lastWeek = duplicateVotes.filter(
      dv => new Date(dv.duplicateAttemptTimestamp) >= oneWeekAgo
    ).length;
    
    return {
      total: duplicateVotes.length,
      lastDay,
      lastWeek
    };
  };

  return (
    <VoteContext.Provider
      value={{
        currentUser,
        voteRecords,
        duplicateVotes,
        registerVote,
        checkDuplicateVote,
        flagDuplicateVote,
        getDuplicateVoteStats
      }}
    >
      {children}
    </VoteContext.Provider>
  );
};

export const useVote = () => {
  const context = useContext(VoteContext);
  if (context === undefined) {
    throw new Error('useVote must be used within a VoteProvider');
  }
  return context;
};
 