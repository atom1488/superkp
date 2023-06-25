import { ClientEvents } from 'discord.js';

//export class Event<Key extends keyof ClientEvents> {

export interface ExtendedEvents extends ClientEvents {
  error: any;
}

export class Event<Key extends keyof ExtendedEvents> {
  constructor(public event: Key, public run: (...args: ExtendedEvents[Key]) => any) {}
}