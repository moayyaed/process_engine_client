import {IIdentity} from '@essential-projects/iam_contracts';
import {DataModels} from '@process-engine/consumer_api_contracts';

export interface IUserTaskClient {

  getSuspendedUserTasksForProcessModel(processModelId: string): Promise<Array<DataModels.UserTasks.UserTask>>;

  getSuspendedUserTasksForProcessInstance(processInstanceId: string): Promise<Array<DataModels.UserTasks.UserTask>>;

  getSuspendedUserTasksForCorrelation(correlationId: string): Promise<Array<DataModels.UserTasks.UserTask>>;

  getSuspendedUserTasksForProcessModelInCorrelation(
    processModelId: string,
    correlationId: string,
  ): Promise<Array<DataModels.UserTasks.UserTask>>;

  getSuspendedUserTasksForClientIdentity(identity: IIdentity): Promise<Array<DataModels.UserTasks.UserTask>>;

  finishUserTask(
    processInstanceId: string,
    correlationId: string,
    userTaskInstanceId: string,
    userTaskResult: DataModels.UserTasks.UserTaskResult,
  ): Promise<void>;

}
