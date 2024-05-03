import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerStatistic, topPlayerOutputType } from './quiz.game.statistic.type';
import { PaginationOutputModel, RequestTopPlayersQueryParamsModel } from '../models/types';
import { sortQueryParamsUserTopFixer } from '../helpers/helpers.functions';

@Injectable()
export class PlayerStatisticQueryRepository {
  constructor(
    @InjectRepository(PlayerStatistic)
    private readonly playerStatisticQueryRepository: Repository<PlayerStatistic>,
  ) {}

  async getTopPlayers(mergedQueryParams: RequestTopPlayersQueryParamsModel): Promise<PaginationOutputModel<topPlayerOutputType>>{
    const queryBuilder = this.playerStatisticQueryRepository.createQueryBuilder('statistic');
    const sortQueryParam = sortQueryParamsUserTopFixer(mergedQueryParams.sort)
    console.log('--sortQueryParam in repository ', sortQueryParam);

    const pageNumber = +mergedQueryParams.pageNumber;
    const pageSize = +mergedQueryParams.pageSize;
    const skipPage = (pageNumber - 1) * pageSize;
    console.log("sortQueryParam[1].sortBy ", sortQueryParam[0].sortBy);

    queryBuilder.select([
      'statistic',
      'player.login'
    ])
    .leftJoin('statistic.Users', 'player')
    
    queryBuilder.orderBy(`statistic.${sortQueryParam[0].sortBy}`, sortQueryParam[0].sortDir)
    // if(sortQueryParam.length > 1){
    //   queryBuilder.addOrderBy(`statistic.${sortQueryParam[1].sortBy}`, sortQueryParam[1].sortDir)
    // }      
    // if(sortQueryParam.length > 2){
    //   queryBuilder.addOrderBy(`statistic.${sortQueryParam[2].sortBy}`, sortQueryParam[2].sortDir)
    // }      
    // if(sortQueryParam.length > 3){
    //   queryBuilder.addOrderBy(`statistic.${sortQueryParam[3].sortBy}`, sortQueryParam[3].sortDir)
    // }   

    for (let i = 1; i < sortQueryParam.length; i++) {
      const sortBy = sortQueryParam[i].sortBy;
      const sortDir = sortQueryParam[i].sortDir;
      queryBuilder.addOrderBy(`statistic.${sortBy}`, sortDir);
    }
    
    queryBuilder.skip(skipPage).take(pageSize)

    const [statistic, statCount] = await queryBuilder.getManyAndCount();
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
    const pageCount = Math.ceil(statCount / pageSize);
    const topPlayers = {
      pagesCount: pageCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: statCount,
      items: statisticForOutput
    }
    return topPlayers
    
    
  }

  
}
