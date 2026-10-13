const dailyChartDates = [
  'Oct 8', 'Oct 7', 'Oct 6', 'Oct 5', 'Oct 4',
  'Oct 3', 'Oct 2', 'Oct 1', 'Sep 30', 'Sep 29',
];

const chart = (name, dates, values) => [{
  name,
  series: dates.map((date, index) => ({ name: date, value: values[index] })),
}];

const chartsByPeriod = (name, daily, weekly, monthly) => ({
  daily: chart(name, dailyChartDates, daily),
  weekly: chart(name, ['Week 38', 'Week 37', 'Week 36', 'Week 35'], weekly),
  monthly: chart(name, ['Oct', 'Sep', 'Aug', 'Jul', 'Jun', 'May'], monthly),
});

export const mockLoginResponse = {
  response: {
    _id: 'mock-org-id',
    email: 'admin@example.com',
    name: 'Demo Organization',
    profilePic: '',
    about: '',
    accessToken: 'local-development-mock-token',
    orgCode: 'DEMO-0001',
    isPasswordChange: false,
    isProfileComplete: true,
    status: 'active',
    insertDate: 1760000000,
  },
  message: 'Login successfull',
};

export const mockDashboard = {
  totalActiveUsers: 142,
  totalCards: 189,
  totalTaps: 4250,
};

export const mockDashboardCharts = {
  Users: chartsByPeriod(
    'User',
    [50, 42, 35, 28, 30, 22, 25, 15, 18, 12],
    [240, 190, 145, 110],
    [1280, 1050, 840, 610, 450, 320]
  ),
  Cards: chartsByPeriod(
    'Card',
    [55, 48, 40, 32, 35, 28, 30, 19, 22, 15],
    [280, 210, 170, 130],
    [1490, 1240, 990, 720, 580, 410]
  ),
  Taps: chartsByPeriod(
    'Taps',
    [820, 730, 610, 490, 520, 410, 450, 280, 310, 240],
    [4200, 3100, 2300, 1800],
    [18900, 15800, 12500, 9400, 7800, 5200]
  ),
};

export const mockDashboardUsers = {
  users: [
    { name: 'Active', value: 120 },
    { name: 'Inactive', value: 22 },
    { name: 'Subscription', value: 142 },
  ],
};

export const mockDashboardCards = {
  cards: [
    { name: 'basicCard', value: 84 },
    { name: 'businessCard', value: 105 },
    { name: 'Active', value: 170 },
    { name: 'Inactive', value: 19 },
  ],
};

export const mockOrganizationProfile = {
  organization: {
    name: 'Demo Organization',
    profilePic: '',
    about: 'Local development profile',
    mobile: '+1 555-0100',
    status: 'active',
    creationDate: '2026-01-01',
    insertDate: 1760000000,
    email: 'admin@example.com',
    orgCode: 'DEMO-0001',
    orgId: 'mock-org-id',
  },
};

export const mockOrders = [
  {
    name: 'Varnika1',
    email: 'varnika1@yopmail.com',
    status: 'active',
    cardType: 'standard',
    mobile: '1234567890',
    address: 'world tech tower',
    creationDate: '2026-10-12T06:22:12.362Z',
    insertDate: 1791786132,
    orderId: '6acc7c94e6dc8f022288a026',
    organizationDetails: {
      name: 'tester',
      email: 'tester@gmail.com',
      orgId: '6979f58aeac8027619e36a62',
    },
  },
];

export const mockPhysicalCards = [
  {
    cardId: 'WT-0001-4821',
    name: 'Test User1',
    email: 'testname@yopmail.com',
    status: 'active',
    creationDate: '2026-10-08T09:15:00.000Z',
  },
];

export const mockUsers = [
  {
    authType: 'app',
    email: 'testname@yopmail.com',
    profilePic: '',
    userName: 'testu568',
    planType: 'Free',
    status: 'active',
    isPremiumUser: false,
    creationDate: '2026-09-23T07:58:19.712Z',
    insertDate: 1790150300,
    name: 'Test User1',
    orgCode: 'TE-6118',
    userId: '6ab3869be6dc8f02228533ee',
  },
];
