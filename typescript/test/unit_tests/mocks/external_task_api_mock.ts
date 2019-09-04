import {IIdentity} from '@essential-projects/iam_contracts';

import {
  APIs,
  DataModels,
} from '@process-engine/consumer_api_contracts';

export class ExternalTaskApiMock implements APIs.IExternalTaskConsumerApi {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public config: any;

  public initialize(): void {}

  public async fetchAndLockExternalTasks<TPayloadType>(
    identity: IIdentity,
    workerId: string,
    topicName: string,
    maxTasks: number,
    longPollingTimeout: number,
    lockDuration: number,
  ): Promise<Array<DataModels.ExternalTask.ExternalTask<TPayloadType>>> {
    return Promise.resolve([]);
  }

  public async extendLock(identity: IIdentity, workerId: string, externalTaskId: string, additionalDuration: number): Promise<void> {
    return Promise.resolve();
  }

  public async handleBpmnError(identity: IIdentity, workerId: string, externalTaskId: string, errorCode: string): Promise<void> {
    return Promise.resolve();
  }

  public async handleServiceError(
    identity: IIdentity,
    workerId: string,
    externalTaskId: string,
    errorMessage: string,
    errorDetails: string,
  ): Promise<void> {
    return Promise.resolve();
  }

  public async finishExternalTask<TResultType>(identity: IIdentity, workerId: string, externalTaskId: string, results: TResultType): Promise<void> {
    return Promise.resolve();
  }

}
