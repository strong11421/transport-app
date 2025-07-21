import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SampleModule } from './sample/sample.module';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',    
      password: '',        
      database: 'test',
      autoLoadEntities: true,
      synchronize: true,
    }),  PostsModule, UsersModule, 
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
