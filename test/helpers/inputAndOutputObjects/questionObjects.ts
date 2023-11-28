const testQuestion = {
    inputQuestion1: {
        body: 'question1',
        correctAnswers: ['correct answer for question1', 'ansForQue1']
    },
    outputQuestion1Sa: {
        id: expect.any(String),
        body: 'question1',
        correctAnswers: ['correct answer for question1', 'ansForQue1'],
        published: false,
        createdAt:expect.any(String),
        updatedAt:expect.any(String),
    }
}