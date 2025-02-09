import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { SuperTodoController } from './super-todo.controller';
import { SuperTodoService } from './super-todo.service';
import { SuperTodoEntity } from './entity/super-todo.entity';
import { UserRole } from '../../common/enum/user-role.enum';
import { HttpApiResponse } from '../../common/utils/api-http.response';
import { CreateSuperTodoDto, UpdateSuperTodoDto } from './dto';

const superTodoResponse = new SuperTodoEntity({ id: '1', title: 'Test Todo' });
describe('SuperTodoController', () => {
  let controller: SuperTodoController;
  let mockSuperTodoService: DeepMocked<SuperTodoService>;

  beforeEach(async () => {
    mockSuperTodoService = createMock<SuperTodoService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuperTodoController],
      providers: [
        {
          provide: SuperTodoService,
          useValue: mockSuperTodoService,
        },
      ],
    }).compile();

    controller = module.get<SuperTodoController>(SuperTodoController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return super todos by user role', () => {
    const userRole = UserRole.FREE;
    const superTodos = [superTodoResponse];
    mockSuperTodoService.findByUserRole.mockReturnValue(
      HttpApiResponse.success(superTodos),
    );

    const result = controller.findByUserRole(userRole);

    expect(result.data).toEqual(superTodos);
    expect(mockSuperTodoService.findByUserRole).toHaveBeenCalledWith(userRole);
  });

  it('should return super todo when create new successfully', () => {
    const superTodo = new CreateSuperTodoDto({ title: 'Test Todo' });
    mockSuperTodoService.create.mockReturnValue(
      HttpApiResponse.success(superTodoResponse),
    );

    const result = controller.create(superTodo);

    expect(result.data).toEqual(superTodoResponse);
    expect(mockSuperTodoService.create).toHaveBeenCalledWith(superTodo);
  });

  it('should return super todo when update successfully', () => {
    const superTodo = new UpdateSuperTodoDto({ title: 'Test Todo' });
    mockSuperTodoService.update.mockReturnValue(
      HttpApiResponse.success(superTodoResponse),
    );

    const result = controller.update(superTodoResponse.id, superTodo);

    expect(result.data).toEqual(superTodoResponse);
    expect(mockSuperTodoService.update).toHaveBeenCalledWith(
      superTodoResponse.id,
      superTodo,
    );
  });

  it('should return super todo when delete successfully', () => {
    mockSuperTodoService.delete.mockReturnValue(HttpApiResponse.success(true));

    const result = controller.delete(superTodoResponse.id);

    expect(result.data).toEqual(true);
    expect(mockSuperTodoService.delete).toHaveBeenCalledWith(
      superTodoResponse.id,
    );
  });
});
