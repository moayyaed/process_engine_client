import {DataModels} from '@process-engine/consumer_api_contracts';

export interface IEventClient {

  // Events
  getSuspendedEventsForProcessModel(processModelId: string): Promise<Array<DataModels.Events.Event>>;

  getSuspendedEventsForCorrelation(correlationId: string): Promise<Array<DataModels.Events.Event>>;

  getSuspendedEventsForProcessModelInCorrelation(processModelId: string, correlationId: string): Promise<Array<DataModels.Events.Event>>;

  triggerMessageEvent(messageName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void>;

  triggerSignalEvent(signalName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void>;
}
