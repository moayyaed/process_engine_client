import {DataModels} from '@process-engine/consumer_api_contracts';

export type HandleExternalTaskAction<TPayload, TResult> =
  (payload: TPayload, externalTask?: DataModels.ExternalTask.ExternalTask<TPayload>) => Promise<TResult>;
