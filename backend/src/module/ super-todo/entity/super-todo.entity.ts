import { UserRole } from '../../../common/enum/user-role.enum';

export class SuperTodoEntity {
  id: string;
  title: string;
  completed: boolean;
  userRole: UserRole;
  notes?: string;
  createdAt: Date;

  constructor(partial: Partial<SuperTodoEntity>) {
    Object.assign(this, partial);
  }
}
