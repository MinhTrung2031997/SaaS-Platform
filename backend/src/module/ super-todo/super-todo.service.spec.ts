import { Test, TestingModule } from '@nestjs/testing';
import { SuperTodoService } from './super-todo.service';
import { UserRole } from '../../common/enum/user-role.enum';
import { CreateSuperTodoDto } from './dto/create-super-todo.dto';
import { UpdateSuperTodoDto } from './dto';
import { InternalException } from '../../common/exception/internal.exception';
import { ErrorCode } from '../../common/utils/error.code';

describe('SuperTodoService', () => {
  let service: SuperTodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuperTodoService],
    }).compile();

    service = module.get<SuperTodoService>(SuperTodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByUserRole', () => {
    it('should return todos for a given user role', () => {
      const userRole = UserRole.PAID;
      const todo = {
        id: '1',
        title: 'Test Todo',
        completed: false,
        userRole: UserRole.PAID,
        createdAt: new Date(),
        notes: 'Test notes',
      };
      service['superTodos'] = [todo];

      const result = service.findByUserRole(userRole);
      expect(result.data).toEqual([todo]);
    });
  });

  describe('create', () => {
    it('should create a new todo', () => {
      const createSuperTodoDto: CreateSuperTodoDto = {
        title: 'New Todo',
        completed: false,
        userRole: UserRole.PAID,
        notes: 'Some notes',
      };

      const result = service.create(createSuperTodoDto);
      expect(result.data).toMatchObject({
        title: 'New Todo',
        completed: false,
        userRole: UserRole.PAID,
        notes: 'Some notes',
      });
    });
  });

  describe('update', () => {
    it('should update an existing todo', () => {
      const todo = {
        id: '1',
        title: 'Test Todo',
        completed: false,
        userRole: UserRole.PAID,
        createdAt: new Date(),
        notes: 'Test notes',
      };
      service['superTodos'] = [todo];

      const updateSuperTodoDto: UpdateSuperTodoDto = {
        title: 'Updated Todo',
        completed: true,
        notes: 'Updated notes',
      };

      const result = service.update('1', updateSuperTodoDto);
      expect(result.data).toMatchObject({
        title: 'Updated Todo',
        completed: true,
        notes: 'Updated notes',
      });
    });

    it('should throw an error if todo not found', () => {
      expect(() =>
        service.update('invalid-id', {} as UpdateSuperTodoDto),
      ).toThrow(
        new InternalException(
          ErrorCode.SUPER_TODO_NOT_FOUND,
          'Super todo not found',
        ),
      );
    });
  });

  describe('delete', () => {
    it('should delete an existing todo', () => {
      const todo = {
        id: '1',
        title: 'Test Todo',
        completed: false,
        userRole: UserRole.PAID,
        createdAt: new Date(),
        notes: 'Test notes',
      };
      service['superTodos'] = [todo];

      const result = service.delete('1');
      expect(result.data).toBe(true);
      expect(service['superTodos']).toHaveLength(0);
    });

    it('should throw an error if todo not found', () => {
      expect(() => service.delete('invalid-id')).toThrow(
        new InternalException(
          ErrorCode.SUPER_TODO_NOT_FOUND,
          'Super todo not found',
        ),
      );
    });
  });
});
