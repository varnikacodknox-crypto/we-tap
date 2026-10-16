import { http, HttpResponse } from 'msw';
import { apiUrl } from '../api/client';
import {
  mockDashboard,
  mockDashboardCards,
  mockDashboardCharts,
  mockDashboardUsers,
  mockLoginResponse,
  mockOrders,
  mockOrganizationProfile,
  mockPhysicalCards,
  mockRequestedCards,
  mockUsers,
} from './fixtures';

const success = (data) =>
  HttpResponse.json({ apiId: 'local-mock', statusCode: 200, message: 'Success', data });

export const handlers = [
  http.post(apiUrl('/api/organization/login'), () => success({
    response: mockLoginResponse.response,
    message: mockLoginResponse.message,
  })),
  http.get(apiUrl('/api/dashboard'), () => success(mockDashboard)),
  ...Object.entries({
    Users: '/api/dashboard/subscription',
    Cards: '/api/dashboard/card',
    Taps: '/api/dashboard/taps',
  }).map(([metric, path]) =>
    http.get(apiUrl(path), ({ request }) => {
      const query = new URL(request.url).searchParams;
      const period = query.get('type') || 'daily';
      const limit = Number(query.get('limit')) || 10;
      const series = mockDashboardCharts[metric][period] || mockDashboardCharts[metric].daily;
      return success(series.map((item) => ({
        ...item,
        series: item.series.slice(0, limit),
      })));
    })
  ),
  http.get(apiUrl('/api/dashboard/users'), () => success(mockDashboardUsers)),
  http.get(apiUrl('/api/dashboard/cards'), () => success(mockDashboardCards)),
  http.get(apiUrl('/api/organization/profile'), () => success(mockOrganizationProfile)),
  http.put(apiUrl('/api/organization'), async ({ request }) => {
    Object.assign(mockOrganizationProfile.organization, await request.json());
    return success({
      message: 'Organization updated successfully',
      response: mockOrganizationProfile.organization,
    });
  }),
  http.get(apiUrl('/api/orders/list'), ({ request }) => {
    const query = new URL(request.url).searchParams;
    const limit = Number(query.get('limit')) || 5;
    const offset = Number(query.get('offset')) || 0;

    return success({
      totalCount: mockOrders.length,
      orderList: mockOrders.slice(offset, offset + limit),
    });
  }),
  http.get(apiUrl('/api/card/physicalCards'), ({ request }) => {
    const query = new URL(request.url).searchParams;
    const limit = Number(query.get('limit')) || 5;
    const offset = Number(query.get('offset')) || 0;

    return success({
      totalCount: mockPhysicalCards.length,
      cardList: mockPhysicalCards.slice(offset, offset + limit),
    });
  }),
  http.get(apiUrl('/api/card/requestedCardAccess'), ({ request }) => {
    const query = new URL(request.url).searchParams;
    const limit = Number(query.get('limit')) || 5;
    const offset = Number(query.get('offset')) || 0;

    return success({
      totalCount: mockRequestedCards.length,
      cardRequestList: mockRequestedCards.slice(offset, offset + limit),
    });
  }),
  http.get(apiUrl('/api/card'), () => {
    return success({
      totalCount: 1,
      cardList: [
        {
          name: 'test1',
          email: 'test1@yopmail.com',
          cardTitle: '',
          status: 'active',
          cardType: 'basicCard',
          mobile: '',
          jobTitle: '',
          company: '',
          address: '',
          bio: '',
          profileTheme: '#ffffff',
          isColorYourIcon: false,
          profilePic: '',
          coverPic: '',
          logo: '',
          isDefault: true,
          creationDate: '2026-10-14T06:58:22.494Z',
          cardId: '6acf280e06a211634de8b93c',
        },
      ],
    });
  }),
  http.get(apiUrl('/api/link'), () => {
    return success({
      totalCount: 1,
      linkAddedList: [
        {
          userId: '6acf280e06a211634de8b939',
          ishighlight: false,
          userTitle: 'Email1',
          link: 'test1@yopmail.com',
          isShow: true,
          isMakeDirect: false,
          creationDate: '2026-10-14T06:58:23.009Z',
          insertDate: 1791961103,
          linkaddedId: '6acf280f06a211634de8b945',
          title: 'Email',
          icon: 'https://s3.us-east-1.amazonaws.com/wetap/weTap/1686044460104_Email_picture.png',
        },
      ],
    });
  }),
  http.post(apiUrl('/api/orders'), async ({ request }) => {
    const order = await request.json();
    const createdOrder = {
      ...order,
      status: 'active',
      creationDate: new Date().toISOString(),
      insertDate: Math.floor(Date.now() / 1000),
      orderId: `mock-order-${Date.now()}`,
      organizationDetails: mockOrders[0].organizationDetails,
    };
    mockOrders.unshift(createdOrder);

    return success({
      message: 'Order Placed successfully',
      response: createdOrder,
    });
  }),
  http.get(apiUrl('/api/user/list'), ({ request }) => {
    const query = new URL(request.url).searchParams;
    const limit = Number(query.get('limit')) || 5;
    const offset = Number(query.get('offset')) || 0;

    return success({
      totalCount: mockUsers.length,
      users: mockUsers.slice(offset, offset + limit),
    });
  }),
  http.put(apiUrl('/api/user/update'), async ({ request }) => {
    const { userId, status, name, email } = await request.json();
    const user = mockUsers.find((item) => item.userId === userId);

    if (!user) {
      return HttpResponse.json(
        { apiId: 'local-mock', statusCode: 404, message: 'User not found.' },
        { status: 404 }
      );
    }

    if (status !== undefined) user.status = status;
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    return success({
      response: {
        userLink: 'https://adminwetap.codknox.com/',
        profilePic: user.profilePic,
        bio: '',
        name: user.name,
        email: user.email,
        coverPic: '',
        mobile: '',
        status: user.status,
      },
      message: 'User updated successfully',
    });
  }),
  http.post(apiUrl('/api/subscription/assign'), async ({ request }) => {
    const subscription = await request.json();
    const user = mockUsers.find((item) => item.userId === subscription.userId);

    if (!user) {
      return HttpResponse.json(
        { apiId: 'local-mock', statusCode: 404, message: 'User not found.' },
        { status: 404 }
      );
    }

    if (subscription.status === 'canceled') {
      user.isPremiumUser = false;
      return success({
        userId: subscription.userId,
        subscriptionStartDateInSeconds: 1791756000,
        subscriptionExpireDateInSeconds: 1792187940,
        status: 'upcoming',
        creationDate: new Date().toISOString(),
        insertDate: Math.floor(Date.now() / 1000),
      });
    }

    user.planType = 'Subscribed';
    return success({});
  }),
  http.post(apiUrl('/api/link/linkAudit'), async () => {
    return success({
      totalCount: 1,
      linkAddedLogs: [
        {
          _id: '6acf351806a211634de8bdb2',
          email: null,
          name: null,
          role: 'org',
          typeOfAction: 'linkUpdated',
          previousData: {
            userTitle: 'Email',
            link: 'test1@yopmail.com',
          },
          updatedData: {
            userTitle: 'Email',
            link: 'test1@yopmail.com',
          },
          creationDate: '2026-10-14T07:54:00.971Z',
          insertDate: 1791964441,
        },
      ],
    });
  }),
  http.put(apiUrl('/api/link/added'), async ({ request }) => {
    const body = await request.json();
    return success({
      message: 'Link updated successfully',
      response: {
        userId: '6acf280e06a211634de8b939',
        userTitle: body.userTitle || 'Email1',
        ishighlight: false,
        link: body.link || 'test1@yopmail.com',
        isShow: true,
        creationDate: new Date().toISOString(),
        insertDate: Math.floor(Date.now() / 1000),
        isMakeDirect: false,
      },
    });
  }),
  http.all(`${apiUrl('/')}*`, () =>
    HttpResponse.json(
      { message: 'No local mock handler exists for this API request.' },
      { status: 501 }
    )
  ),
];
