
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "../users/user.entity";


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

export class PlayerStatisticDbType {
    constructor(
        public userId: string,
        public sumScore: number,
        public avgScores: number,
        public gamesCount: number,
        public winsCount: number,
        public lossesCount: number,
        public drawsCount: number,
    ){}
}

@Entity({name: 'PlayerStatistic'})
export class PlayerStatistic extends PlayerStatisticDbType {
    @PrimaryGeneratedColumn('uuid')
    playerStatisticId: string;
    @OneToOne(() => Users, (u) => u.PlayerStatistic, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({name: 'userId'})
    Users: Users   
    @Column('uuid')
    userId: string;
    @Column()
    sumScore: number;
    @Column()
    avgScores: number;
    @Column()
    gamesCount: number;
    @Column()
    winsCount: number;
    @Column()
    lossesCount: number;
    @Column()
    drawsCount: number;

    recountAvgScore() {
        if (this.gamesCount !== 0) {
            this.avgScores = this.sumScore / this.gamesCount;
        } else {
            this.avgScores = 0;
        }
    }
}

export enum enumDirForStat {
    sumScore = "sumScore",
    avgScores = "avgScores",
    gamesCount = "gamesCount",
    winsCount = "winsCount",
    lossesCount = "lossesCount",
    drawsCount = "drawsCount"
}