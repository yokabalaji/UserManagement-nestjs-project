import { AppAbility } from './ability';

export type PolicyHandlerCallback = (
  ability: AppAbility,
  can?,
  user?,
) => boolean;

export interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;
