import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
} from '@casl/ability';

import { User } from '../models/user.entity';
import { Permission } from 'src/models/permission.entity';
import { Role } from 'src/models/role.entity';

type Subjects =
  | InferSubjects<typeof User | typeof Role | typeof Permission>
  | 'all'
  | 'Permission'
  | 'Role'
  | 'User';

console.log('ability class');

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type AppAbility = PureAbility<[Action, Subjects]>;

export function defineAbilitiesFor(user: User) {
  const { can, cannot, build } = new AbilityBuilder(
    PureAbility as AbilityClass<AppAbility>,
  );

  if (user && user.roles && user.roles.some((role) => role.name === 'admin')) {
    can(Action.Manage, 'all'); // Admin can manage everything
  } else if (user && user.roles) {
    user.roles.forEach((role) => {
      if (role.permissions) {
        role.permissions.forEach((permission) => {
          let subject: Subjects;
          switch (permission.model) {
            case 'user':
              subject = User;
              break;
            case 'permission':
              subject = Permission;
              break;
            case 'role':
              subject = Role;
              break;
            default:
              throw new Error(`Unknown model: ${permission.model}`);
          }
          can(permission.action as Action, subject);
        });
      }
    });
  }

  return build({
    detectSubjectType: (item) =>
      item.constructor as ExtractSubjectType<Subjects>,
  });
}
