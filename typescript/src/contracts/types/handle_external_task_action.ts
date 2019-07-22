import {ExternalTask} from '@process-engine/external_task_api_contracts';

export type HandleExternalTaskAction<TPayload, TResult> = (payload: TPayload, externalTask?: ExternalTask<TPayload>) => Promise<TResult>;
