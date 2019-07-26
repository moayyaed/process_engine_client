import {DataModels} from '@process-engine/consumer_api_contracts';

export interface IEmptyActivityClient {

  getSuspendedEmptyActivitiesForProcessModel(processModelId: string): Promise<Array<DataModels.EmptyActivities.EmptyActivity>>;

  getSuspendedEmptyActivitiesForProcessInstance(processInstanceId: string): Promise<Array<DataModels.EmptyActivities.EmptyActivity>>;

  getSuspendedEmptyActivitiesForCorrelation(correlationId: string): Promise<Array<DataModels.EmptyActivities.EmptyActivity>>;

  getSuspendedEmptyActivitiesForProcessModelInCorrelation(
    processModelId: string,
    correlationId: string,
  ): Promise<Array<DataModels.EmptyActivities.EmptyActivity>>;

  getSuspendedEmptyActivitiesForClientIdentity(): Promise<Array<DataModels.EmptyActivities.EmptyActivity>>;

  finishEmptyActivity(
    processInstanceId: string,
    correlationId: string,
    emptyActivityInstanceId: string,
  ): Promise<void>;
}
