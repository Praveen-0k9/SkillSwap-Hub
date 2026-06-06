export const currentUser = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex.johnson@skillswap.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  bio: 'Full-stack developer passionate about React and Node.js. Always eager to learn new technologies and share knowledge.',
  skills: ['React', 'Node.js', 'TypeScript', 'Python', 'UI/UX Design'],
  role: 'student',
  online: true,
  verified: true,
  joinedDate: '2024-01-15',
  rating: 4.8,
  reviewCount: 24
};

export const mockUsers = [
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    bio: 'Data scientist specializing in ML and AI. Love teaching and collaborating on innovative projects.',
    skills: ['Python', 'Machine Learning', 'Data Analysis', 'TensorFlow'],
    role: 'student',
    online: true,
    verified: true,
    joinedDate: '2024-02-20',
    rating: 4.9,
    reviewCount: 31
  },
  {
    id: '3',
    name: 'Marcus Thompson',
    email: 'marcus.t@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    bio: 'Mobile app developer with expertise in React Native and Flutter. Building the future one app at a time.',
    skills: ['React Native', 'Flutter', 'iOS Development', 'Android'],
    role: 'student',
    online: false,
    verified: true,
    joinedDate: '2023-11-10',
    rating: 4.7,
    reviewCount: 18
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    bio: 'UX/UI designer with a passion for creating beautiful, user-friendly interfaces.',
    skills: ['Figma', 'Adobe XD', 'UI Design', 'Prototyping'],
    role: 'student',
    online: true,
    verified: true,
    joinedDate: '2024-03-05',
    rating: 5.0,
    reviewCount: 42
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'david.kim@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    bio: 'Backend engineer focused on scalable systems and cloud architecture.',
    skills: ['Go', 'Kubernetes', 'AWS', 'Docker', 'PostgreSQL'],
    role: 'student',
    online: true,
    verified: true,
    joinedDate: '2023-12-01',
    rating: 4.6,
    reviewCount: 15
  }
];

export const mockSkills = [
  {
    id: 's1',
    name: 'Advanced React Patterns',
    category: 'Web Development',
    description: 'Learn advanced React patterns including hooks, context, and performance optimization techniques.',
    level: 'Advanced',
    userId: '2',
    userName: 'Sarah Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    rating: 4.9,
    bookmarked: true
  },
  {
    id: 's2',
    name: 'Machine Learning Fundamentals',
    category: 'Data Science',
    description: 'Introduction to ML concepts, algorithms, and practical implementation using Python and scikit-learn.',
    level: 'Intermediate',
    userId: '2',
    userName: 'Sarah Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    rating: 5.0,
    bookmarked: false
  },
  {
    id: 's3',
    name: 'Mobile App Development with Flutter',
    category: 'Mobile Development',
    description: 'Build beautiful cross-platform mobile apps using Flutter and Dart.',
    level: 'Intermediate',
    userId: '3',
    userName: 'Marcus Thompson',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    rating: 4.8,
    bookmarked: true
  },
  {
    id: 's4',
    name: 'UI/UX Design Principles',
    category: 'Design',
    description: 'Master the fundamentals of user interface and user experience design.',
    level: 'Beginner',
    userId: '4',
    userName: 'Emily Rodriguez',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    rating: 5.0,
    bookmarked: false
  },
  {
    id: 's5',
    name: 'Cloud Architecture with AWS',
    category: 'DevOps',
    description: 'Learn to design and deploy scalable cloud solutions using Amazon Web Services.',
    level: 'Advanced',
    userId: '5',
    userName: 'David Kim',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    rating: 4.7,
    bookmarked: false
  },
  {
    id: 's6',
    name: 'Python for Data Analysis',
    category: 'Data Science',
    description: 'Use Python, Pandas, and NumPy for data manipulation and analysis.',
    level: 'Intermediate',
    userId: '2',
    userName: 'Sarah Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    rating: 4.9,
    bookmarked: true
  },
  {
    id: 's7',
    name: 'TypeScript Best Practices',
    category: 'Web Development',
    description: 'Write better, safer code with TypeScript types, interfaces, and advanced features.',
    level: 'Intermediate',
    userId: '1',
    userName: 'Alex Johnson',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    rating: 4.6,
    bookmarked: false
  },
  {
    id: 's8',
    name: 'Docker & Containerization',
    category: 'DevOps',
    description: 'Master containerization with Docker for efficient application deployment.',
    level: 'Intermediate',
    userId: '5',
    userName: 'David Kim',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    rating: 4.8,
    bookmarked: false
  }
];

export const mockNotifications = [
  {
    id: 'n1',
    type: 'request',
    title: 'New Collaboration Request',
    message: 'Sarah Chen wants to collaborate on React Advanced Patterns',
    timestamp: '2 minutes ago',
    read: false,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  {
    id: 'n2',
    type: 'message',
    title: 'New Message',
    message: 'Marcus Thompson sent you a message',
    timestamp: '1 hour ago',
    read: false,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus'
  },
  {
    id: 'n3',
    type: 'review',
    title: 'New Review',
    message: 'Emily Rodriguez left a 5-star review for your TypeScript skill',
    timestamp: '3 hours ago',
    read: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily'
  },
  {
    id: 'n4',
    type: 'system',
    title: 'Profile Verified',
    message: 'Your profile has been successfully verified!',
    timestamp: '1 day ago',
    read: true
  }
];

export const mockChatMessages = [
  {
    id: 'm1',
    senderId: '2',
    senderName: 'Sarah Chen',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    content: 'Hey! I saw your React project. Would love to collaborate!',
    timestamp: '10:30 AM',
    read: true
  },
  {
    id: 'm2',
    senderId: '1',
    senderName: 'Alex Johnson',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    content: 'That would be great! What did you have in mind?',
    timestamp: '10:35 AM',
    read: true
  },
  {
    id: 'm3',
    senderId: '2',
    senderName: 'Sarah Chen',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    content: "I'm working on an advanced state management tutorial. Your expertise would be perfect!",
    timestamp: '10:37 AM',
    read: true
  }
];

export const mockRequests = [
  {
    id: 'r1',
    fromUser: mockUsers[0],
    skill: 'Advanced React Patterns',
    message: "Hi! I'd love to learn from your React expertise. Can we collaborate on a project together?",
    timestamp: '2 hours ago',
    status: 'pending'
  },
  {
    id: 'r2',
    fromUser: mockUsers[2],
    skill: 'TypeScript Best Practices',
    message: 'Your TypeScript skills are impressive! Want to work on a mobile app together?',
    timestamp: '5 hours ago',
    status: 'pending'
  },
  {
    id: 'r3',
    fromUser: mockUsers[3],
    skill: 'UI/UX Design',
    message: 'I need help with the design of my web app. Would you be interested in collaborating?',
    timestamp: '1 day ago',
    status: 'accepted'
  }
];

export const skillCategories = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'DevOps',
  'Cloud Computing',
  'Design',
  'Backend Development',
  'Database',
  'Cybersecurity'
];

export const dashboardStats = {
  totalSkills: 5,
  collaborations: 12,
  connections: 48,
  rating: 4.8
};

export const initialChatLogs = {
  '2': [
    { id: 'm1', senderId: '2', senderName: 'Sarah Chen', content: 'Hey! I saw your React project. Would love to collaborate!', timestamp: '10:30 AM', read: false },
    { id: 'm2', senderId: '1', senderName: 'Alex Johnson', content: 'That would be great! What did you have in mind?', timestamp: '10:35 AM', read: true },
    { id: 'm3', senderId: '2', senderName: 'Sarah Chen', content: "I'm working on an advanced state management tutorial. Your expertise would be perfect!", timestamp: '10:37 AM', read: false }
  ],
  '3': [
    { id: 'm4', senderId: '3', senderName: 'Marcus Thompson', content: 'Hey! I saw your React project. Would love to collaborate!', timestamp: '10:30 AM', read: false }
  ],
  '4': [
    { id: 'm5', senderId: '4', senderName: 'Emily Rodriguez', content: 'Hey! I saw your React project. Would love to collaborate!', timestamp: '10:30 AM', read: false }
  ],
  '5': [
    { id: 'm6', senderId: '5', senderName: 'David Kim', content: 'Hey! I saw your React project. Would love to collaborate!', timestamp: '10:30 AM', read: false }
  ]
};
