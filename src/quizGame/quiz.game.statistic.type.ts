
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

@Entity({name: 'PlayerStatistic'})
export class PlayerStatistic {
    @PrimaryColumn('uuid')
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

    // @OneToOne(() => Users, (u) => u.PlayerStatistic)
    // @JoinColumn({name: 'userId'})
    // Users: Users
}