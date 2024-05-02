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
    
    
  }

  
}
