import {IIdentity} from '@essential-projects/iam_contracts';
import {IExternalTaskApi} from '@process-engine/external_task_api_contracts';

import {HandleExternalTaskAction} from '../../../src/contracts/index';

export class ExternalTaskWorkerMock {

  private readonly externalTaskApi: IExternalTaskApi = undefined;

  constructor(externalTaskApi: IExternalTaskApi) {
    this.externalTaskApi = externalTaskApi;
  }

  public async waitForAndHandle<TPayload>(
    identity: IIdentity,
    topic: string,
    maxTasks: number,
    longpollingTimeout: number,
    handleAction: HandleExternalTaskAction<TPayload>,
  ): Promise<void> {
    return Promise.resolve();
  }

  public stop(): void {
  }

}
