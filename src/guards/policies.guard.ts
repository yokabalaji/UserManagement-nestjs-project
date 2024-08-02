import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../abilities/common-ability-schema-language-factory';
import { CHECK_POLICIES_KEY } from '../decorators/policies.decorator';
import { PolicyHandler } from '../abilities/policy-handler.interface';
import { AppAbility } from '../abilities/ability';
import { User } from '../models/user.entity';
import { UserService } from 'src/services/user.service';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];
    console.log('policy hanlder   ' + policyHandlers);

    const request = context.switchToHttp().getRequest();

    const users = request.user as User;
    console.log('User payload from request:   ', users);
    const user = await this.userService.findOne(users['userId']);
    if (!user) {
      console.log('User not found');
      return false;
    }
    console.log('Fetched user:   ', user);
    const ability = this.caslAbilityFactory.createUserAbilityForUser(user);
    console.log('Generated ability:    ', ability);

    const result = policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
    console.log('Policy check result:   ', result);
    return result;
  }

  private execPolicyHandler(
    handler: PolicyHandler,
    ability: AppAbility,
  ): boolean {
    if (typeof handler === 'function') {
      const result = handler(ability);
      console.log('Policy handler function result:   ', result);
      return result;
    }
    const result = handler.handle(ability);
    console.log('Policy handler object result:    ', result);
    return result;
  }
}
