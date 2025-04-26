import  { User, Election } from '../types';

export const currentUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  voterId: 'JD12345678',
  hasVoted: false,
  registrationDate: '2023-01-15',
};

export const elections: Election[] = [
  {
    id: '1',
    title: 'Presidential Election 2023',
    description: 'National presidential election to elect the next head of state.',
    startDate: '2023-08-01',
    endDate: '2023-08-05',
    status: 'active',
    candidates: [
      {
        id: '1',
        name: 'Jane Smith',
        party: 'Progressive Party',
        position: 'President',
        votes: 1245,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw0fHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDB8fHx8MTc0NTU3MTE3NXww&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200'
      },
      {
        id: '2',
        name: 'Robert Johnson',
        party: 'Unity Alliance',
        position: 'President',
        votes: 980,
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDB8fHx8MTc0NTU3MTE3NXww&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200'
      },
      {
        id: '3',
        name: 'Sarah Williams',
        party: 'People\'s Coalition',
        position: 'President',
        votes: 1100,
        image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDB8fHx8MTc0NTU3MTE3NXww&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200'
      }
    ]
  },
  {
    id: '2',
    title: 'Local Council Elections',
    description: 'Elections for your local city council representatives.',
    startDate: '2023-09-15',
    endDate: '2023-09-17',
    status: 'upcoming',
    candidates: [
      {
        id: '4',
        name: 'Michael Brown',
        party: 'Community First',
        position: 'Council Member',
        votes: 0,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDB8fHx8MTc0NTU3MTE3NXww&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200'
      },
      {
        id: '5',
        name: 'Emily Davis',
        party: 'Progress Alliance',
        position: 'Council Member',
        votes: 0,
        image: 'https://images.unsplash.com/photo-1474176857210-7287d38d27c6?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw1fHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDB8fHx8MTc0NTU3MTE3NXww&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200'
      }
    ]
  }
];
 