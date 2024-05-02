import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerStatistic, topPlayerOutputType } from './quiz.game.statistic.type';
import { PaginationOutputModel, RequestTopPlayersQueryParamsModel } from '../models/types';

@Injectable()
export class PlayerStatisticQueryRepository {
  constructor(
    @InjectRepository(PlayerStatistic)
    private readonly playerStatisticQueryRepository: Repository<PlayerStatistic>,
  ) {}

  async getTopPlayers(queryParams: RequestTopPlayersQueryParamsModel): Promise<PaginationOutputModel<topPlayerOutputType>>{
    const queryBuilder = this.playerStatisticQueryRepository.createQueryBuilder('statistic');
    queryBuilder.select([
      'statistic',
      'player.login'
    ])
    .leftJoin('statistic.Users', 'player')

    const statistic = await queryBuilder.getMany()
    const statisticForOutput = statistic.map((stat) => {
    return {
      sumScore: stat.sumScore,
      avgScores: stat.avgScores,
      gamesCount: stat.gamesCount,
      winsCount: stat.winsCount,
      lossesCount: stat.lossesCount,
      drawsCount: stat.drawsCount,
      player: {
        id: stat.userId,
        login: stat.Users.login
      }
    }
  })
    const topPlayers = {
      pagesCount: 0,
      page: 0,
      pageSize: 0,
      totalCount: 0,
      items: statisticForOutput
    }
    return topPlayers
    
    
  }

  
}
