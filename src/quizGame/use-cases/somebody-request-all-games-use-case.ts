import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QuizGamesRepository } from "../quiz.game.repository";

export class PlayerRequestAllGamesCommand {
    constructor(public userId) {}
}

@CommandHandler(PlayerRequestAllGamesCommand)
export class PlayerRequestAllGamesUseCase
implements ICommandHandler<PlayerRequestAllGamesCommand>{
    constructor(
        private readonly quizGamesRepository: QuizGamesRepository
    ) {}

    async execute(command: PlayerRequestAllGamesCommand): Promise<any> {
        const result = await this.quizGamesRepository.getAllGames(command.userId)
        return result
    }
}