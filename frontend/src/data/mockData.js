export const categories = [
  'Hackathons',
  'Workshops',
  'Webinars',
  'Competitions',
  'Conferences',
  'Coding Challenges',
  'Design Challenges',
  'Ideathons',
  'Quizzes',
  'Case Study Competitions',
  'Internship Opportunities',
  'Job Opportunities',
  'Research Programs',
  'Technical Events',
  'Non-Technical Events',
  'Cultural Events',
  'Sports Events'
];

export const domains = [
  'AI/ML',
  'Data Science',
  'Cybersecurity',
  'Cloud Computing',
  'Web Development',
  'Mobile Development',
  'Networking',
  'IoT',
  'Blockchain',
  'Robotics',
  'Business',
  'Marketing',
  'Finance',
  'Entrepreneurship'
];

export const eligibilityOptions = ['Pre-University', 'Undergraduate', 'Postgraduate', 'Open To All'];

export const sampleEvents = [
  {
    id: 1,
    title: 'NovaHack Inter-College Hackathon',
    category: 'Hackathons',
    domain: 'AI/ML',
    organizer: 'STUDENOVA Labs',
    conducting_organization: 'STUDENOVA Labs',
    college: 'Global Institute of Technology',
    date: '2026-06-08T09:00:00',
    deadline: '2026-06-01T23:59:00',
    location: 'Bengaluru',
    mode: 'Offline',
    eligibility: 'Undergraduate',
    team_size: '2-4',
    prize_pool: 250000,
    registration_status: 'Open',
    registration_link: 'https://devfolio.co/',
    seats_available: 180,
    registrations_count: 132,
    tags: ['FinTech', 'Product', '24-hour'],
    image_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    description: 'Build high-impact prototypes with mentors, recruiters, and product leaders across a focused 24-hour sprint.'
  },
  {
    id: 2,
    title: 'Cloud Careers Internship Drive',
    category: 'Internship Opportunities',
    domain: 'Cloud Computing',
    organizer: 'Aster Cloud',
    conducting_organization: 'Aster Cloud',
    college: 'Open to all colleges',
    date: '2026-05-29T11:00:00',
    deadline: '2026-05-25T18:00:00',
    location: 'Online',
    mode: 'Online',
    eligibility: 'Open To All',
    team_size: 'Individual',
    prize_pool: 0,
    registration_status: 'Closed',
    registration_link: 'https://www.hackerearth.com/challenges/',
    seats_available: 75,
    registrations_count: 61,
    tags: ['Cloud', 'Internship', 'Recruitment'],
    image_url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80',
    description: 'Meet hiring teams, solve a short challenge, and apply for cloud engineering internships.'
  },
  {
    id: 3,
    title: 'Cultural Night: Pulse 2026',
    category: 'Cultural Events',
    domain: 'Marketing',
    organizer: 'Arts Council',
    conducting_organization: 'North City University Arts Council',
    college: 'North City University',
    date: '2026-06-15T18:30:00',
    deadline: '2026-06-05T20:00:00',
    location: 'Delhi',
    mode: 'Offline',
    eligibility: 'Open To All',
    team_size: '1-8',
    prize_pool: 75000,
    registration_status: 'Open',
    registration_link: 'https://unstop.com/',
    seats_available: 500,
    registrations_count: 421,
    tags: ['Music', 'Dance', 'Open Mic'],
    image_url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80',
    description: 'A cross-campus cultural evening featuring student performances, food stalls, and live showcases.'
  },
  {
    id: 4,
    title: 'Design Systems Workshop',
    category: 'Workshops',
    domain: 'Web Development',
    organizer: 'Framer India Guild',
    conducting_organization: 'Framer India Guild',
    college: 'Westfield School of Design',
    date: '2026-06-02T10:00:00',
    deadline: '2026-05-30T23:00:00',
    location: 'Mumbai',
    mode: 'Hybrid',
    eligibility: 'Undergraduate',
    team_size: 'Individual',
    prize_pool: 15000,
    registration_status: 'Closing Soon',
    registration_link: 'https://hack2skill.com/',
    seats_available: 120,
    registrations_count: 88,
    tags: ['Product', 'UI', 'Portfolio'],
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    description: 'Hands-on workshop for building polished product interfaces, portfolios, and reusable components.'
  },
  {
    id: 5,
    title: 'Future of Mobility Conference',
    category: 'Conferences',
    domain: 'Robotics',
    organizer: 'Urban Tech Forum',
    conducting_organization: 'Urban Tech Forum',
    college: 'Open to all colleges',
    date: '2026-06-21T09:30:00',
    deadline: '2026-06-12T18:00:00',
    location: 'Hyderabad',
    mode: 'Offline',
    eligibility: 'Postgraduate',
    team_size: 'Individual',
    prize_pool: 50000,
    registration_status: 'Open',
    registration_link: 'https://unstop.com/',
    seats_available: 300,
    registrations_count: 214,
    tags: ['EV', 'Research', 'Policy'],
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    description: 'Research talks, student poster sessions, and networking with transport startups and labs.'
  },
  {
    id: 6,
    title: 'Campus Talent Recruitment Day',
    category: 'Job Opportunities',
    domain: 'Web Development',
    organizer: 'Northstar Systems',
    conducting_organization: 'Northstar Systems',
    college: 'Partner colleges only',
    date: '2026-06-12T09:00:00',
    deadline: '2026-06-07T17:00:00',
    location: 'Online',
    mode: 'Online',
    eligibility: 'Undergraduate',
    team_size: 'Individual',
    prize_pool: 0,
    registration_status: 'Open',
    registration_link: 'https://www.hackerearth.com/jobs/',
    seats_available: 90,
    registrations_count: 73,
    tags: ['SDE', 'Aptitude', 'Placements'],
    image_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    description: 'A structured recruitment drive with shortlists, coding assessments, and interview slots.'
  }
];

export const analytics = [
  { name: 'Hackathons', registrations: 420 },
  { name: 'Workshops', registrations: 310 },
  { name: 'Internships', registrations: 260 },
  { name: 'Culture', registrations: 510 },
  { name: 'Drives', registrations: 290 }
];

export const studentNotifications = [
  { id: 1, type: 'Recommendation', title: '3 AI/ML hackathons match your profile', when: 'Today', tone: 'bg-blue-50 text-blue-700' },
  { id: 2, type: 'Deadline', title: 'Design Systems Workshop closes in 24 hours', when: 'Tomorrow', tone: 'bg-amber-50 text-amber-700' },
  { id: 3, type: 'Certificate', title: 'Cloud Careers participation certificate is available', when: '2 days ago', tone: 'bg-emerald-50 text-emerald-700' },
  { id: 4, type: 'Results', title: 'NovaHack finalist results announced', when: 'May 28', tone: 'bg-rose-50 text-rose-700' }
];

export const studentAchievements = [
  { id: 1, title: 'Top 10 Finalist', event: 'NovaHack Inter-College Hackathon', proof: 'Winner certificate', prize: 'Rs. 25,000' },
  { id: 2, title: '5 Event Streak', event: 'Participation streak badge', proof: 'Badge', prize: 'Portfolio highlight' },
  { id: 3, title: 'Cloud Intern Shortlist', event: 'Cloud Careers Internship Drive', proof: 'Result email', prize: 'Interview access' }
];

export const studentCommunities = [
  { id: 1, name: 'AI/ML Builders', members: 1420, focus: 'Hackathons, research programs, teammate matching' },
  { id: 2, name: 'Product Design Circle', members: 680, focus: 'Design challenges, portfolios, feedback rooms' },
  { id: 3, name: 'Cloud & DevOps Guild', members: 920, focus: 'Workshops, certifications, internship referrals' }
];
