import {IIdentity} from '@essential-projects/iam_contracts';
import {DataModels} from '@process-engine/consumer_api_contracts';

export interface IUserTaskClient {

  getSuspendedUserTasksForProcessModel(processModelId: string): Promise<DataModels.UserTasks.UserTaskList>;

  getSuspendedUserTasksForProcessInstance(processInstanceId: string): Promise<DataModels.UserTasks.UserTaskList>;

  getSuspendedUserTasksForCorrelation(correlationId: string): Promise<DataModels.UserTasks.UserTaskList>;

  getSuspendedUserTasksForProcessModelInCorrelation(
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.UserTasks.UserTaskList>;

  getSuspendedUserTasksForClientIdentity(identity: IIdentity): Promise<DataModels.UserTasks.UserTaskList>;

  finishUserTask(
    processInstanceId: string,
    correlationId: string,
    userTaskInstanceId: string,
    userTaskResult: DataModels.UserTasks.UserTaskResult,
  ): Promise<void>;

}
