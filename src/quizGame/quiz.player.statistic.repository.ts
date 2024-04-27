import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerStatistic } from './quiz.game.statistic.type';

@Injectable()
export class PlayerStatisticRepository {
  constructor(
    @InjectRepository(PlayerStatistic)
    private readonly playerStatisticRepository: Repository<PlayerStatistic>,
  ) {}

  
}
