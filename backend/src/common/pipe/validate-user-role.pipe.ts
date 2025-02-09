import { PipeTransform, Injectable } from '@nestjs/common';
import { UserRole } from '../enum/user-role.enum';
import { InternalException } from '../exception';
import { ErrorCode } from '../utils/error.code';

@Injectable()
export class ValidateUserRolePipe implements PipeTransform {
  transform(userRole: UserRole) {
    if (!Object.values(UserRole).includes(userRole)) {
      throw new InternalException(
        ErrorCode.INVALID_USER_ROLE,
        `Invalid role. Allowed values: ${Object.values(UserRole).join(', ')}`,
      );
    }

    return userRole;
  }
}
