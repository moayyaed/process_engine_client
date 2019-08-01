import {DataModels} from '@process-engine/consumer_api_contracts';

export interface IManualTaskClient {

  // ManualTasks
  getSuspendedManualTasksForProcessModel(processModelId: string): Promise<Array<DataModels.ManualTasks.ManualTask>>;

  getSuspendedManualTasksForProcessInstance(processInstanceId: string): Promise<Array<DataModels.ManualTasks.ManualTask>>;

  getSuspendedManualTasksForCorrelation(correlationId: string): Promise<Array<DataModels.ManualTasks.ManualTask>>;

  getSuspendedManualTasksForProcessModelInCorrelation(
    processModelId: string,
    correlationId: string,
  ): Promise<Array<DataModels.ManualTasks.ManualTask>>;

  getSuspendedManualTasksForClientIdentity(): Promise<Array<DataModels.ManualTasks.ManualTask>>;

  finishManualTask(
    processInstanceId: string,
    correlationId: string,
    manualTaskInstanceId: string,
  ): Promise<void>;
}
