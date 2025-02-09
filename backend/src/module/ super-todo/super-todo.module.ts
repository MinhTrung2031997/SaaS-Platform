import { Module } from '@nestjs/common';
import { SuperTodoController } from './super-todo.controller';
import { SuperTodoService } from './super-todo.service';

@Module({
  controllers: [SuperTodoController],
  providers: [SuperTodoService],
  exports: [],
})
export class SuperTodoModule {}
