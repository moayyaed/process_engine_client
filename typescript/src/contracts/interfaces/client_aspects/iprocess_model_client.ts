import {DataModels} from '@process-engine/consumer_api_contracts';

import {ProcessStartRequest, ProcessStartResponse} from '../../types/index';

export interface IProcessModelClient {

  getProcessModels(): Promise<DataModels.ProcessModels.ProcessModelList>;

  getProcessModelById(processModelId: string): Promise<DataModels.ProcessModels.ProcessModel>;

  getProcessModelByProcessInstanceId(processInstanceId: string): Promise<DataModels.ProcessModels.ProcessModel>;

  startProcessInstance<TRequestPayload, TResponsePayload>(
    processModelId: string,
    startEventId: string,
    requestParams?: ProcessStartRequest<TRequestPayload>,
    startCallbackType?: DataModels.ProcessModels.StartCallbackType,
    endEventId?: string,
  ): Promise<ProcessStartResponse<TResponsePayload>>;

  getResultForProcessModelInCorrelation(correlationId: string, processModelId: string): Promise<Array<DataModels.CorrelationResult>>;

  getProcessInstancesForClientIdentity(): Promise<Array<DataModels.ProcessInstance>>;

}
