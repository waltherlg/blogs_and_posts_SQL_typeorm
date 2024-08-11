export const testInputBlogBody = {
  blog1: {
    name: 'Blog1',
    description: 'Description1',
    websiteUrl: 'https://www.someweb.com',
  },
  blog2: {
    name: 'Blog2',
    description: 'Description2',
    websiteUrl: 'https://www.someweb.com',
  },
  blog3: {
    name: 'Blog3',
    description: 'Description3',
    websiteUrl: 'https://www.someweb.com',
  },
  blog4: {
    name: 'Blog4',
    description: 'Description4',
    websiteUrl: 'https://www.someweb.com',
  },
  Tim: {
    name: 'Tim',
    description: 'description',
    websiteUrl: 'https://someurl.com',
  },
  Tima: {
    name: 'Tima',
    description: 'description',
    websiteUrl: 'https://someurl.com',
  },
  Timma: {
    name: 'Timma',
    description: 'description',
    websiteUrl: 'https://someurl.com',
  },
  timm: {
    name: 'timm',
    description: 'description',
    websiteUrl: 'https://someurl.com',
  },
};

export const testOutputBlogBody = {
  blog1: {
    id: expect.any(String),
    name: 'Blog1',
    description: 'Description1',
    websiteUrl: 'https://www.someweb.com',
    createdAt: expect.any(String),
    isMembership: false,
    images: {
      wallpaper: null,
      main: [],
    },
    currentUserSubscriptionStatus: expect.any(String),
    subscribersCount: expect.any(Number)
  },
  blog2: {
    id: expect.any(String),
    name: 'Blog2',
    description: 'Description2',
    websiteUrl: 'https://www.someweb.com',
    createdAt: expect.any(String),
    isMembership: false,
    images: {
      wallpaper: null,
      main: [],
    },
    currentUserSubscriptionStatus: expect.any(String),
    subscribersCount: expect.any(Number)
  },
  blog3: {
    id: expect.any(String),
    name: 'Blog3',
    description: 'Description3',
    websiteUrl: 'https://www.someweb.com',
    createdAt: expect.any(String),
    isMembership: false,
    images: {
      wallpaper: null,
      main: [],
    },
    currentUserSubscriptionStatus: expect.any(String),
    subscribersCount: expect.any(Number)
  },
  blog4: {
    id: expect.any(String),
    name: 'Blog4',
    description: 'Description4',
    websiteUrl: 'https://www.someweb.com',
    createdAt: expect.any(String),
    isMembership: false,
    images: {
      wallpaper: null,
      main: [],
    },
    currentUserSubscriptionStatus: expect.any(String),
    subscribersCount: expect.any(Number)
  },
  Tim: {
    id: expect.any(String),
    name: 'Tim',
    description: 'description',
    websiteUrl: 'https://someurl.com',
    createdAt: expect.any(String),
    isMembership: false,
    images: {
      wallpaper: null,
      main: [],
    },
    currentUserSubscriptionStatus: expect.any(String),
    subscribersCount: expect.any(Number)
  },
  Tima: {
    id: expect.any(String),
    name: 'Tima',
    description: 'description',
    websiteUrl: 'https://someurl.com',
    createdAt: expect.any(String),
    isMembership: false,
    images: {
      wallpaper: null,
      main: [],
    },
    currentUserSubscriptionStatus: expect.any(String),
    subscribersCount: expect.any(Number)
  },
  Timma: {
    id: expect.any(String),
    name: 'Timma',
    description: 'description',
    websiteUrl: 'https://someurl.com',
    createdAt: expect.any(String),
    isMembership: false,
    images: {
      wallpaper: null,
      main: [],
    },
    currentUserSubscriptionStatus: expect.any(String),
    subscribersCount: expect.any(Number)
  },
  timm: {
    id: expect.any(String),
    name: 'timm',
    description: 'description',
    websiteUrl: 'https://someurl.com',
    createdAt: expect.any(String),
    isMembership: false,
    images: {
      wallpaper: null,
      main: [],
    },
    currentUserSubscriptionStatus: expect.any(String),
    subscribersCount: expect.any(Number)
  },
};
