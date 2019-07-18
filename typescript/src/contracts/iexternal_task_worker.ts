import {IExternalTaskWorker} from '@process-engine/external_task_api_contracts';

export interface IExternalTaskWorker extends IExternalTaskWorker {
  /**
   * Indicates if the worker is currently polling for and handling ExternalTasks.
   */
  isActive: boolean;

  /**
   * Tells the worker to stop polling for and handling ExternalTasks.
   */
  stop(): void;
}
