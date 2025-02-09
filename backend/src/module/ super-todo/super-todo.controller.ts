import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { SuperTodoService } from './super-todo.service';
import { SuperTodoEntity } from './entity/super-todo.entity';
import { HttpApiResponse } from '../../common/utils/api-http.response';
import { UserRole } from '../../common/enum/user-role.enum';
import { ValidateUserRolePipe } from '../../common/pipe';
import { CreateSuperTodoDto, UpdateSuperTodoDto } from './dto';

@Controller('super-todo')
export class SuperTodoController {
  constructor(private readonly superTodoService: SuperTodoService) {}

  @Get()
  findByUserRole(
    @Query('userRole', ValidateUserRolePipe) userRole: UserRole,
  ): HttpApiResponse<SuperTodoEntity[]> {
    const superTodos = this.superTodoService.findByUserRole(userRole);
    return superTodos;
  }

  @Post()
  create(
    @Body() createSuperTodoDto: CreateSuperTodoDto,
  ): HttpApiResponse<SuperTodoEntity> {
    const superTodo = this.superTodoService.create(createSuperTodoDto);
    return superTodo;
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() payload: UpdateSuperTodoDto,
  ): HttpApiResponse<SuperTodoEntity> {
    return this.superTodoService.update(id, payload);
  }

  @Delete(':id')
  delete(@Param('id') id: string): HttpApiResponse<boolean> {
    return this.superTodoService.delete(id);
  }
}
