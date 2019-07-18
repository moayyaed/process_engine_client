import {IIdentity} from '@essential-projects/iam_contracts';
import {ExternalTask} from '@process-engine/external_task_api_contracts';

/**
 * Interface for implementing the ExternalTaskWorker used by the ProcessEngineClient.
 *
 * This is not meant to be used by the end user.
 */
export interface IExternalTaskWorker {

  /**
   * Id of worker
   */
  workerId: string;

  /**
   * Indicates if the worker is currently polling for and handling ExternalTasks.
   */
  isActive: boolean;

  /**
   * Periodically fetches, locks and processes available ExternalTasks with a given topic,
   * using the given callback as a processing function.
   *
   * @async
   * @param identity           The identity to use for fetching and processing ExternalTasks.
   * @param topic              The topic by which to look for and process ExternalTasks.
   * @param maxTasks           max. ExternalTasks to fetch.
   * @param longpollingTimeout Longpolling Timeout in ms.
   * @param handleAction       The function for processing the ExternalTasks.
   */
  subscribeToExternalTasksWithTopic<TPayload, TResult>(
    identity: IIdentity,
    topic: string,
    maxTasks: number,
    longpollingTimeout: number,
    handleAction: HandleExternalTaskAction<TPayload, TResult>,
  ): Promise<void>;

  /**
   * Tells the worker to stop polling for and handling ExternalTasks.
   */
  stop(): void;
}

export type HandleExternalTaskAction<TPayload, TResult> = (payload: TPayload, externalTask?: ExternalTask<TPayload>) => Promise<TResult>;
