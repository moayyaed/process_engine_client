import {DataModels} from '@process-engine/consumer_api_contracts';

export interface IManualTaskClient {

  // ManualTasks
  getSuspendedManualTasksForProcessModel(processModelId: string): Promise<DataModels.ManualTasks.ManualTaskList>;

  getSuspendedManualTasksForProcessInstance(processInstanceId: string): Promise<DataModels.ManualTasks.ManualTaskList>;

  getSuspendedManualTasksForCorrelation(correlationId: string): Promise<DataModels.ManualTasks.ManualTaskList>;

  getSuspendedManualTasksForProcessModelInCorrelation(
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.ManualTasks.ManualTaskList>;

  getSuspendedManualTasksForClientIdentity(): Promise<DataModels.ManualTasks.ManualTaskList>;

  finishManualTask(
    processInstanceId: string,
    correlationId: string,
    manualTaskInstanceId: string,
  ): Promise<void>;
}
