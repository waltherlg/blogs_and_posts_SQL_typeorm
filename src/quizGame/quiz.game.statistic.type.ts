

export type topPlayerOutputType = 
{
    sumScore: number;
    avgScores: number;
    gamesCount: number;
    winsCount: number;
    lossesCount: number;
    drawsCount: number;
    player: playerInTopPlayerOutputType
}

type playerInTopPlayerOutputType = {
    id: string;
    login: string;
}