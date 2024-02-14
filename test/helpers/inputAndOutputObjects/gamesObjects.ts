export let testGames = {

    outputActiveGame: {
    id: expect.any(String),
    firstPlayerProgress: {
      answers: expect.any(Array),
      player: {
        id: expect.any(Array),
        login: expect.any(Array),
      },
      score: expect.any(Number),
    },
    secondPlayerProgress: {
      answers: expect.any(Array),
      player: {
        id: expect.any(Array),
        login: expect.any(Array),
      },
      score: expect.any(Number),
    },
    questions: expect.any(Array.length === 5),
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
            id: expect.any(Array),
            login: expect.any(Array),
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
          answers: expect.any(Array.length === 5),
          player: {
            id: expect.any(Array),
            login: expect.any(Array),
          },
          score: expect.any(Number),
        },
        secondPlayerProgress: {
          answers: expect.any(Array.length === 5),
          player: {
            id: expect.any(Array),
            login: expect.any(Array),
          },
          score: expect.any(Number),
        },
        questions: expect.any(Array.length === 5),
        status: 'Finished',
        pairCreatedDate: expect.any(String),
        startGameDate: expect.any(String),
        finishGameDate: expect.any(String),
        },
  };