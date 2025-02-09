import { Module } from '@nestjs/common';
import { SuperTodoModule } from './module/ super-todo/super-todo.module';
import { validate } from './common/config/env.validation';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './module/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validate,
    }),
    HealthModule,
    SuperTodoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
