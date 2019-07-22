import {HandleExternalTaskAction, IExternalTaskWorker} from '../iexternal_task_worker';

export interface IExternalTaskClient {

  subscribeToExternalTasksWithTopic<TPayload, TResult>(
    topic: string,
    handleAction: HandleExternalTaskAction<TPayload, TResult>,
    maxTasks?: number,
    timeout?: number,
  ): IExternalTaskWorker;

}
