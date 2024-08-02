import { Injectable } from '@nestjs/common';
import { defineAbilitiesFor, AppAbility } from './ability';
import { User } from '../models/user.entity';

@Injectable()
export class CaslAbilityFactory {
  createUserAbilityForUser(user: User): AppAbility {
    return defineAbilitiesFor(user);
  }
}
