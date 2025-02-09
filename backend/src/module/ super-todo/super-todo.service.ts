import { Injectable } from '@nestjs/common';
import { SuperTodoEntity } from './entity/super-todo.entity';
import { CreateSuperTodoDto } from './dto/create-super-todo.dto';
import { v4 as uuidv4 } from 'uuid';
import { HttpApiResponse } from '../../common/utils/api-http.response';
import { InternalException } from '../../common/exception/internal.exception';
import { UserRole } from '../../common/enum/user-role.enum';
import { UpdateSuperTodoDto } from './dto';
import { ErrorCode } from '../../common/utils/error.code';

@Injectable()
export class SuperTodoService {
  private superTodos: SuperTodoEntity[] = [];

  findByUserRole(userRole: UserRole): HttpApiResponse<SuperTodoEntity[]> {
    const superTodos = this.superTodos.filter((t) => t.userRole === userRole);
    superTodos.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return HttpApiResponse.success<SuperTodoEntity[]>(superTodos);
  }

  create(
    createSuperTodoDto: CreateSuperTodoDto,
  ): HttpApiResponse<SuperTodoEntity> {
    const { title, completed, notes, userRole } = createSuperTodoDto;
    const newTodo = new SuperTodoEntity({
      id: uuidv4(),
      title,
      completed,
      userRole,
      createdAt: new Date(),
    });

    if (userRole === UserRole.PAID) {
      newTodo.notes = notes;
    }

    this.superTodos.push(newTodo);
    return HttpApiResponse.success<SuperTodoEntity>(newTodo);
  }

  update(
    id: string,
    payload: UpdateSuperTodoDto,
  ): HttpApiResponse<SuperTodoEntity> {
    const todo = this.superTodos.find((t) => t.id === id);
    if (!todo) {
      throw new InternalException(
        ErrorCode.SUPER_TODO_NOT_FOUND,
        'Super todo not found',
      );
    }
    const updateSuperTodo = new SuperTodoEntity({
      title: payload.title,
      completed: payload.completed,
    });

    if (todo.userRole === UserRole.PAID) {
      updateSuperTodo.notes = payload.notes;
    }

    const res = Object.assign(todo, updateSuperTodo);
    return HttpApiResponse.success<SuperTodoEntity>(res);
  }

  delete(id: string): HttpApiResponse<boolean> {
    const index = this.superTodos.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new InternalException(
        ErrorCode.SUPER_TODO_NOT_FOUND,
        'Super todo not found',
      );
    }

    this.superTodos.splice(index, 1);
    return HttpApiResponse.success<boolean>(true);
  }
}
