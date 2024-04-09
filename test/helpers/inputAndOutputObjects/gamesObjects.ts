


export const testGames = {
  outputGameForDynamicChanges: {
    id: expect.any(String),
    firstPlayerProgress: {
      answers: expect.any(Array),
      player: {
        id: expect.any(String),
        login: expect.any(String),
      },
      score: 0,
    },
    secondPlayerProgress: {
      answers: expect.any(Array),
      player: {
        id: expect.any(String),
        login: expect.any(String),
      },
      score: 0,
    },
    questions: expect.any(Array),
    status: 'Active',
    pairCreatedDate: expect.any(String),
    startGameDate: expect.any(String),
    finishGameDate: null,
  },

  outputGameForDynamicChanges2: {
    id: expect.any(String),
    firstPlayerProgress: {
      answers: expect.any(Array),
      player: {
        id: expect.any(String),
        login: expect.any(String),
      },
      score: 0,
    },
    secondPlayerProgress: {
      answers: expect.any(Array),
      player: {
        id: expect.any(String),
        login: expect.any(String),
      },
      score: 0,
    },
    questions: expect.any(Array),
    status: 'Active',
    pairCreatedDate: expect.any(String),
    startGameDate: expect.any(String),
    finishGameDate: null,
  },

  outputActiveGame: {
    id: expect.any(String),
    firstPlayerProgress: {
      answers: expect.any(Array),
      player: {
        id: expect.any(String),
        login: expect.any(String),
      },
      score: expect.any(Number),
    },
    secondPlayerProgress: {
      answers: expect.any(Array),
      player: {
        id: expect.any(String),
        login: expect.any(String),
      },
      score: expect.any(Number),
    },
    questions: expect.any(Array),
    status: 'Active',
    pairCreatedDate: expect.any(String),
    startGameDate: expect.any(String),
    finishGameDate: null,
  },

  outputPandingGame: {
    id: expect.any(String),
    firstPlayerProgress: {
      answers: expect.any(Array),
      player: {
        id: expect.any(String),
        login: expect.any(String),
      },
      score: expect.any(Number),
    },
    secondPlayerProgress: null,
    questions: null,
    status: 'PendingSecondPlayer',
    pairCreatedDate: expect.any(String),
    startGameDate: null,
    finishGameDate: null,
  },

  outputFinishedGame: {
    id: expect.any(String),
    firstPlayerProgress: {
      answers: expect.any(Array),
      player: {
        id: expect.any(String),
        login: expect.any(String),
      },
      score: expect.any(Number),
    },
    secondPlayerProgress: {
      answers: expect.any(Array),
      player: {
        id: expect.any(String),
        login: expect.any(String),
      },
      score: expect.any(Number),
    },
    questions: expect.any(Array),
    status: 'Finished',
    pairCreatedDate: expect.any(String),
    startGameDate: expect.any(String),
    finishGameDate: expect.any(String),
  },
};
