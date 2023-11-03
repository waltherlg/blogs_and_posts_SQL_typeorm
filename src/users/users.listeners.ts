import { PostLikes } from '../likes/db.likes.types';
import {
    EventSubscriber,
    EntitySubscriberInterface,
    UpdateEvent,
    EntityManager,
    Repository,
  } from 'typeorm';
import { Users } from './users.types';
import { InjectRepository } from '@nestjs/typeorm';

  
  @EventSubscriber()
  export class UsersSubscriber implements EntitySubscriberInterface<Users> {
    constructor(private readonly entityManager: EntityManager,
                @InjectRepository(PostLikes) private readonly postLikesRepository: Repository<PostLikes> ){}

    listenTo() {
      return Users;
    }
  
    async beforeUpdate(event: UpdateEvent<Users>) {
        console.log(' beforeUpdate сработал ');
        
      if (event.databaseEntity.isUserBanned !== event.entity.isUserBanned) {
        // Найдите все записи в PostLikes, связанные с этим пользователем и обновите isUserBanned
        await this.postLikesRepository.createQueryBuilder()
          .update()
          .set({ isUserBanned: event.entity.isUserBanned })
          .where('userId = :userId', { userId: event.entity.userId })
          .execute();
      }
    }
  }