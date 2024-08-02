import { SetMetadata } from '@nestjs/common';
import { PolicyHandler } from '../abilities/policy-handler.interface';

export const CHECK_POLICIES_KEY = 'check_policies';
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
