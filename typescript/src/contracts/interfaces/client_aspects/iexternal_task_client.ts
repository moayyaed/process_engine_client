import {IExternalTaskWorker} from '../iexternal_task_worker';

import {HandleExternalTaskAction} from '../../types/index';

export interface IExternalTaskClient {

  subscribeToExternalTasksWithTopic<TPayload, TResult>(
    topic: string,
    handleAction: HandleExternalTaskAction<TPayload, TResult>,
    maxTasks?: number,
    timeout?: number,
  ): IExternalTaskWorker;

}
