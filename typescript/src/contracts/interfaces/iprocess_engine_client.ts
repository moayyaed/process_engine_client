import {ClientAspects} from './client_aspects/index';

export interface IProcessEngineClient
  extends ClientAspects.IEmptyActivityClient,
  ClientAspects.IEventClient,
  ClientAspects.IManualTaskClient,
  ClientAspects.INotificationClient,
  ClientAspects.IProcessModelClient,
  ClientAspects.IUserTaskClient {}
