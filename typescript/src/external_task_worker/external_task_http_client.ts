import {IRequestOptions} from '@essential-projects/http_contracts';
import {HttpClient} from '@essential-projects/http';
import {IIdentity} from '@essential-projects/iam_contracts';

import {
  ExtendLockRequestPayload,
  ExternalTask,
  FetchAndLockRequestPayload,
  FinishExternalTaskRequestPayload,
  HandleBpmnErrorRequestPayload,
  HandleServiceErrorRequestPayload,
  IExternalTaskApi,
  restSettings,
} from '@process-engine/external_task_api_contracts';

import {HttpClientConfig} from '../contracts/index';

export class ExternalTaskHttpClient implements IExternalTaskApi {

  public config: HttpClientConfig;

  private baseUrl = 'api/external_task/v1';

  private httpClient: HttpClient = undefined;

  public initialize(): void {
    this.httpClient = new HttpClient();
    this.httpClient.config = this.config;
  }

  public async fetchAndLockExternalTasks<TPayloadType>(
    identity: IIdentity,
    workerId: string,
    topicName: string,
    maxTasks: number,
    longPollingTimeout: number,
    lockDuration: number,
  ): Promise<Array<ExternalTask<TPayloadType>>> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const url = this.applyBaseUrl(restSettings.paths.fetchAndLockExternalTasks);

    const payload = new FetchAndLockRequestPayload(workerId, topicName, maxTasks, longPollingTimeout, lockDuration);

    const httpResponse = await this.httpClient.post<FetchAndLockRequestPayload, Array<ExternalTask<TPayloadType>>>(url, payload, requestAuthHeaders);

    return httpResponse.result;
  }

  public async extendLock(identity: IIdentity, workerId: string, externalTaskId: string, additionalDuration: number): Promise<void> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.extendLock
      .replace(restSettings.params.externalTaskId, externalTaskId);

    const url = this.applyBaseUrl(restPath);

    const payload = new ExtendLockRequestPayload(workerId, additionalDuration);

    await this.httpClient.post<ExtendLockRequestPayload, void>(url, payload, requestAuthHeaders);
  }

  public async handleBpmnError(identity: IIdentity, workerId: string, externalTaskId: string, errorCode: string): Promise<void> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.handleBpmnError
      .replace(restSettings.params.externalTaskId, externalTaskId);

    const url = this.applyBaseUrl(restPath);

    const payload = new HandleBpmnErrorRequestPayload(workerId, errorCode);

    await this.httpClient.post<HandleBpmnErrorRequestPayload, void>(url, payload, requestAuthHeaders);
  }

  public async handleServiceError(
    identity: IIdentity,
    workerId: string,
    externalTaskId: string,
    errorMessage: string,
    errorDetails: string,
  ): Promise<void> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.handleServiceError
      .replace(restSettings.params.externalTaskId, externalTaskId);

    const url = this.applyBaseUrl(restPath);

    const payload = new HandleServiceErrorRequestPayload(workerId, errorMessage, errorDetails);

    await this.httpClient.post<HandleServiceErrorRequestPayload, void>(url, payload, requestAuthHeaders);
  }

  public async finishExternalTask<TResultType>(identity: IIdentity, workerId: string, externalTaskId: string, results: TResultType): Promise<void> {

    const requestAuthHeaders = this.createRequestAuthHeaders(identity);

    const restPath = restSettings.paths.finishExternalTask
      .replace(restSettings.params.externalTaskId, externalTaskId);

    const url = this.applyBaseUrl(restPath);

    const payload = new FinishExternalTaskRequestPayload(workerId, results);

    await this.httpClient.post<FinishExternalTaskRequestPayload<TResultType>, void>(url, payload, requestAuthHeaders);
  }

  private createRequestAuthHeaders(identity: IIdentity): IRequestOptions {

    const noAuthTokenProvided = !identity || typeof identity.token !== 'string';
    if (noAuthTokenProvided) {
      return {};
    }

    const requestAuthHeaders: IRequestOptions = {
      headers: {
        Authorization: `Bearer ${identity.token}`,
      },
    };

    return requestAuthHeaders;
  }

  private applyBaseUrl(url: string): string {
    return `${this.baseUrl}${url}`;
  }

}
