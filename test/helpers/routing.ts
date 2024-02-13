export const endpoints = {
  wipeAllData: '/testing/all-data',

  bloggerBlogs: '/blogger/blogs',
  bloggerUsers: '/blogger/users',

  comments: '/comments',
  saUsers: '/sa/users',
  saBlogs: '/sa/blogs',
  blogs: '/blogs',
  posts: '/posts',
  auth: '/auth',
  devices: '/security/devices',
  quizQuestions: '/sa/quiz/questions',
  pairGameQuiz: '/pair-game-quiz',
};

export const delayFunction = async (ms: number) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};
