import {IIdentity} from '@essential-projects/iam_contracts';
import {DataModels} from '@process-engine/consumer_api_contracts';

export class ProcessModelServiceMock {

  private fixturesToUse: any;

  constructor(fixturesToUse?: any) {
    this.fixturesToUse = fixturesToUse || {};
  }

  public onCalledCallback = (...args): any => {};

  public async startProcessInstance(
    identity: IIdentity,
    processModelId: string,
    payload: DataModels.ProcessModels.ProcessStartRequestPayload,
    startCallbackType: DataModels.ProcessModels.StartCallbackType,
    startEventId?: string,
    endEventId?: string,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload> {
    this.onCalledCallback(identity, processModelId, payload, startCallbackType, startEventId, endEventId);
    return Promise.resolve(this.fixturesToUse);
  }

}
