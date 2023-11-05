import { DataSource } from "typeorm";

export default new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'nest',
        password: 'nest',
        database: 'blogs_and_posts_typeorm',
        synchronize: false,
        entities: ['src/**/*.entity{.ts,.js}']
      }
)