import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Questions } from "./quiz.game.types";
import { Repository } from "typeorm";


@Injectable()
export class QuestionsRepository {
    constructor (
        @InjectRepository(Questions)
        private readonly questionsRepository: Repository<Questions>
    ) {}

    
    
}