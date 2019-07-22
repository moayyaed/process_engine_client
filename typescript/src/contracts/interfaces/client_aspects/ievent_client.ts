import {DataModels} from '@process-engine/consumer_api_contracts';

export interface IEventClient {

  // Events
  getSuspendedEventsForProcessModel(processModelId: string): Promise<DataModels.Events.EventList>;

  getSuspendedEventsForCorrelation(correlationId: string): Promise<DataModels.Events.EventList>;

  getSuspendedEventsForProcessModelInCorrelation(processModelId: string, correlationId: string): Promise<DataModels.Events.EventList>;

  triggerMessageEvent(messageName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void>;

  triggerSignalEvent(signalName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void>;
}
