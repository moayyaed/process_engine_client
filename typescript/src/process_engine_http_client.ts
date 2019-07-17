/* eslint-disable @typescript-eslint/no-explicit-any */
import * as uuid from 'node-uuid';
import * as io from 'socket.io-client';

import {UnauthorizedError} from '@essential-projects/errors_ts';
import {Subscription} from '@essential-projects/event_aggregator_contracts';
import {IRequestOptions} from '@essential-projects/http_contracts';
import {HttpClient} from '@essential-projects/http';
import {IIdentity} from '@essential-projects/iam_contracts';

import {
  restSettings as ConsumerRestSettings,
  DataModels,
  Messages,
  socketSettings,
} from '@process-engine/consumer_api_contracts';

import {
  ExtendLockRequestPayload,
  ExternalTask,
  restSettings as ExternalTaskRestSettings,
  FetchAndLockRequestPayload,
  FinishExternalTaskRequestPayload,
  HandleBpmnErrorRequestPayload,
  HandleServiceErrorRequestPayload,
} from '@process-engine/external_task_api_contracts';

/**
 * Connects a Subscription ID to a specific callback.
 * This allows us to remove that Subscription from SocketIO
 * when "ExternalAccessor.removeSubscription" is called.
 */
type SubscriptionCallbackAssociation = {[subscriptionId: string]: any};

export class ProcessEngineHttpClient {

  private readonly baseConsumerApiUrl = 'api/consumer/v1';
  private readonly baseExternalTaskApiUrl = 'api/external_task/v1';;
  private readonly processEngineUrl: string;
  private readonly identity: IIdentity;

  private readonly dummyIdentity: IIdentity = {
    token: 'ZHVtbXlfdG9rZW4=',
    userId: 'dummy_token',
  }

  private socketForIdentity: SocketIOClient.Socket;
  private subscriptionCollection: SubscriptionCallbackAssociation = {};

  private httpClient: HttpClient;

  constructor(processEngineUrl: string, identity?: IIdentity) {
    this.processEngineUrl = processEngineUrl;
    this.identity = identity || this.dummyIdentity;
  }

  public initialize(): void {
    this.httpClient = new HttpClient();
    this.httpClient.config = {
      url: this.processEngineUrl,
    };
    this.createSocketForIdentity();
  }

  public disconnectSocket(): void {
    this.removeSocketForIdentity();
  }

  // Notifications
  public async onActivityReached(
    callback: Messages.CallbackTypes.OnActivityReachedCallback,
    subscribeOnce: boolean = false,
  ): Promise<any> {
    return this.createSocketIoSubscription(socketSettings.paths.activityReached, callback, subscribeOnce);
  }

  public async onActivityFinished(
    callback: Messages.CallbackTypes.OnActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<any> {
    return this.createSocketIoSubscription(socketSettings.paths.activityFinished, callback, subscribeOnce);
  }
  // ------------ For backwards compatibility only

  public async onCallActivityWaiting(
    callback: Messages.CallbackTypes.OnCallActivityWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.createSocketIoSubscription(socketSettings.paths.callActivityWaiting, callback, subscribeOnce);
  }

  public async onCallActivityFinished(
    callback: Messages.CallbackTypes.OnCallActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.createSocketIoSubscription(socketSettings.paths.callActivityFinished, callback, subscribeOnce);
  }

  // ------------

  public async onEmptyActivityWaiting(
    callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    return this.createSocketIoSubscription(socketSettings.paths.emptyActivityWaiting, callback, subscribeOnce);
  }

  public async onEmptyActivityFinished(
    callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    return this.createSocketIoSubscription(socketSettings.paths.emptyActivityFinished, callback, subscribeOnce);
  }

  public async onEmptyActivityForIdentityWaiting(
    callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    const socketEventName = socketSettings.paths.emptyActivityForIdentityWaiting
      .replace(socketSettings.pathParams.userId, this.identity.userId);

    return this.createSocketIoSubscription(socketEventName, callback, subscribeOnce);
  }

  public async onEmptyActivityForIdentityFinished(
    callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    const socketEventName = socketSettings.paths.emptyActivityForIdentityFinished
      .replace(socketSettings.pathParams.userId, this.identity.userId);

    return this.createSocketIoSubscription(socketEventName, callback, subscribeOnce);
  }

  public async onUserTaskWaiting(
    callback: Messages.CallbackTypes.OnUserTaskWaitingCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    return this.createSocketIoSubscription(socketSettings.paths.userTaskWaiting, callback, subscribeOnce);
  }

  public async onUserTaskFinished(
    callback: Messages.CallbackTypes.OnUserTaskFinishedCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    return this.createSocketIoSubscription(socketSettings.paths.userTaskFinished, callback, subscribeOnce);
  }

  public async onBoundaryEventTriggered(
    callback: Messages.CallbackTypes.OnBoundaryEventTriggeredCallback,
    subscribeOnce: boolean = false,
  ): Promise<any> {
    return this.createSocketIoSubscription(socketSettings.paths.boundaryEventTriggered, callback, subscribeOnce);
  }

  public async onIntermediateThrowEventTriggered(
    callback: Messages.CallbackTypes.OnIntermediateThrowEventTriggeredCallback,
    subscribeOnce: boolean = false,
  ): Promise<any> {
    return this.createSocketIoSubscription(socketSettings.paths.intermediateThrowEventTriggered, callback, subscribeOnce);
  }

  public async onIntermediateCatchEventReached(
    callback: Messages.CallbackTypes.OnIntermediateCatchEventReachedCallback,
    subscribeOnce: boolean = false,
  ): Promise<any> {
    return this.createSocketIoSubscription(socketSettings.paths.intermediateCatchEventReached, callback, subscribeOnce);
  }

  public async onIntermediateCatchEventFinished(
    callback: Messages.CallbackTypes.OnIntermediateCatchEventFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<any> {
    return this.createSocketIoSubscription(socketSettings.paths.intermediateCatchEventFinished, callback, subscribeOnce);
  }

  public async onUserTaskForIdentityWaiting(
    callback: Messages.CallbackTypes.OnUserTaskWaitingCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    const socketEventName = socketSettings.paths.userTaskForIdentityWaiting
      .replace(socketSettings.pathParams.userId, this.identity.userId);

    return this.createSocketIoSubscription(socketEventName, callback, subscribeOnce);
  }

  public async onUserTaskForIdentityFinished(
    callback: Messages.CallbackTypes.OnUserTaskFinishedCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    const socketEventName = socketSettings.paths.userTaskForIdentityFinished
      .replace(socketSettings.pathParams.userId, this.identity.userId);

    return this.createSocketIoSubscription(socketEventName, callback, subscribeOnce);
  }

  public async onProcessTerminated(
    callback: Messages.CallbackTypes.OnProcessTerminatedCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    return this.createSocketIoSubscription(socketSettings.paths.processTerminated, callback, subscribeOnce);
  }

  public async onProcessError(
    callback: Messages.CallbackTypes.OnProcessErrorCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    return this.createSocketIoSubscription(socketSettings.paths.processError, callback, subscribeOnce);
  }

  public async onProcessStarted(
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    return this.createSocketIoSubscription(socketSettings.paths.processStarted, callback, subscribeOnce);
  }

  public async onProcessWithProcessModelIdStarted(
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    processModelId: string,
    subscribeOnce = false,
  ): Promise<Subscription> {
    const eventName = socketSettings.paths.processInstanceStarted
      .replace(socketSettings.pathParams.processModelId, processModelId);

    return this.createSocketIoSubscription(eventName, callback, subscribeOnce);
  }

  public async onManualTaskWaiting(
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    return this.createSocketIoSubscription(socketSettings.paths.manualTaskWaiting, callback, subscribeOnce);
  }

  public async onManualTaskFinished(
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    return this.createSocketIoSubscription(socketSettings.paths.manualTaskFinished, callback, subscribeOnce);
  }

  public async onManualTaskForIdentityWaiting(
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    const socketEventName = socketSettings.paths.manualTaskForIdentityWaiting
      .replace(socketSettings.pathParams.userId, this.identity.userId);

    return this.createSocketIoSubscription(socketEventName, callback, subscribeOnce);
  }

  public async onManualTaskForIdentityFinished(
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    const socketEventName = socketSettings.paths.manualTaskForIdentityFinished
      .replace(socketSettings.pathParams.userId, this.identity.userId);

    return this.createSocketIoSubscription(socketEventName, callback, subscribeOnce);
  }

  public async onProcessEnded(
    callback: Messages.CallbackTypes.OnProcessEndedCallback,
    subscribeOnce = false,
  ): Promise<Subscription> {
    return this.createSocketIoSubscription(socketSettings.paths.processEnded, callback, subscribeOnce);
  }

  public async removeSubscription(subscription: Subscription): Promise<void> {

    if (!this.socketForIdentity) {
      return;
    }

    const callbackToRemove = this.subscriptionCollection[subscription.id];
    if (!callbackToRemove) {
      return;
    }

    this.socketForIdentity.off(subscription.eventName, callbackToRemove);

    delete this.subscriptionCollection[subscription.id];
  }

  // Process models and instances
  public async getProcessModels(): Promise<DataModels.ProcessModels.ProcessModelList> {
    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    const url = this.applyBaseConsumerApiUrl(ConsumerRestSettings.paths.processModels);

    const httpResponse = await this.httpClient.get<DataModels.ProcessModels.ProcessModelList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getProcessModelById(processModelId: string): Promise<DataModels.ProcessModels.ProcessModel> {
    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    let url = ConsumerRestSettings.paths.processModelById.replace(ConsumerRestSettings.params.processModelId, processModelId);
    url = this.applyBaseConsumerApiUrl(url);

    const httpResponse = await this.httpClient.get<DataModels.ProcessModels.ProcessModel>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getProcessModelByProcessInstanceId(processInstanceId: string): Promise<DataModels.ProcessModels.ProcessModel> {
    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    let url = ConsumerRestSettings.paths.processModelByProcessInstanceId.replace(ConsumerRestSettings.params.processInstanceId, processInstanceId);
    url = this.applyBaseConsumerApiUrl(url);

    const httpResponse = await this.httpClient.get<DataModels.ProcessModels.ProcessModel>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async startProcessInstance(
    processModelId: string,
    payload: DataModels.ProcessModels.ProcessStartRequestPayload,
    startCallbackType: DataModels.ProcessModels.StartCallbackType,
    startEventId?: string,
    endEventId?: string,
    processEndedCallback?: Messages.CallbackTypes.OnProcessEndedCallback,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload> {

    const url = this.buildStartProcessInstanceUrl(processModelId, startCallbackType, endEventId, startEventId);

    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    const httpResponse = await this
      .httpClient
      // eslint-disable-next-line max-len
      .post<DataModels.ProcessModels.ProcessStartRequestPayload, DataModels.ProcessModels.ProcessStartResponsePayload>(url, payload, requestAuthHeaders);

    const socketIoSubscriptionRequired = processEndedCallback !== undefined;
    if (socketIoSubscriptionRequired) {
      this.createSocketIoSubscription(socketSettings.paths.processEnded, processEndedCallback, true);
    }

    return httpResponse.result;
  }

  private buildStartProcessInstanceUrl(
    processModelId: string,
    startCallbackType: DataModels.ProcessModels.StartCallbackType,
    endEventId: string,
    startEventId?: string,
  ): string {
    let url = ConsumerRestSettings.paths.startProcessInstance
      .replace(ConsumerRestSettings.params.processModelId, processModelId);

    url = `${url}?start_callback_type=${startCallbackType}`;

    const startEventIdIsGiven = startEventId !== undefined;
    if (startEventIdIsGiven) {
      url = `${url}&start_event_id=${startEventId}`;
    }

    const attachEndEventId = startCallbackType === DataModels.ProcessModels.StartCallbackType.CallbackOnEndEventReached;
    if (attachEndEventId) {
      url = `${url}&end_event_id=${endEventId}`;
    }

    url = this.applyBaseConsumerApiUrl(url);

    return url;
  }

  public async getProcessResultForCorrelation(
    correlationId: string,
    processModelId: string,
  ): Promise<Array<DataModels.CorrelationResult>> {
    let url = ConsumerRestSettings.paths.getProcessResultForCorrelation
      .replace(ConsumerRestSettings.params.correlationId, correlationId)
      .replace(ConsumerRestSettings.params.processModelId, processModelId);

    url = this.applyBaseConsumerApiUrl(url);

    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    const httpResponse = await this.httpClient.get<Array<DataModels.CorrelationResult>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getProcessInstancesByIdentity(): Promise<Array<DataModels.ProcessInstance>> {
    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    let url = ConsumerRestSettings.paths.getOwnProcessInstances;
    url = this.applyBaseConsumerApiUrl(url);

    const httpResponse = await this.httpClient.get<Array<DataModels.ProcessInstance>>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  // Events
  public async getEventsForProcessModel(processModelId: string): Promise<DataModels.Events.EventList> {
    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    let url = ConsumerRestSettings.paths.processModelEvents.replace(ConsumerRestSettings.params.processModelId, processModelId);
    url = this.applyBaseConsumerApiUrl(url);

    const httpResponse = await this.httpClient.get<DataModels.Events.EventList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getEventsForCorrelation(correlationId: string): Promise<DataModels.Events.EventList> {
    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    let url = ConsumerRestSettings.paths.correlationEvents.replace(ConsumerRestSettings.params.correlationId, correlationId);
    url = this.applyBaseConsumerApiUrl(url);

    const httpResponse = await this.httpClient.get<DataModels.Events.EventList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getEventsForProcessModelInCorrelation(
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.Events.EventList> {
    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    let url = ConsumerRestSettings.paths.processModelCorrelationEvents
      .replace(ConsumerRestSettings.params.processModelId, processModelId)
      .replace(ConsumerRestSettings.params.correlationId, correlationId);

    url = this.applyBaseConsumerApiUrl(url);

    const httpResponse = await this.httpClient.get<DataModels.Events.EventList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async triggerMessageEvent(messageName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {
    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    let url = ConsumerRestSettings.paths.triggerMessageEvent
      .replace(ConsumerRestSettings.params.eventName, messageName);

    url = this.applyBaseConsumerApiUrl(url);

    await this.httpClient.post<DataModels.Events.EventTriggerPayload, void>(url, payload, requestAuthHeaders);
  }

  public async triggerSignalEvent(signalName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {
    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    let url = ConsumerRestSettings.paths.triggerSignalEvent
      .replace(ConsumerRestSettings.params.eventName, signalName);

    url = this.applyBaseConsumerApiUrl(url);

    await this.httpClient.post<DataModels.Events.EventTriggerPayload, void>(url, payload, requestAuthHeaders);
  }

  // Empty Activities
  public async getEmptyActivitiesForProcessModel(processModelId: string): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    const restPath = ConsumerRestSettings.paths.processModelEmptyActivities
      .replace(ConsumerRestSettings.params.processModelId, processModelId);

    const url = this.applyBaseConsumerApiUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.EmptyActivities.EmptyActivityList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getEmptyActivitiesForProcessInstance(processInstanceId: string): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    const restPath = ConsumerRestSettings.paths.processInstanceEmptyActivities
      .replace(ConsumerRestSettings.params.processInstanceId, processInstanceId);

    const url = this.applyBaseConsumerApiUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.EmptyActivities.EmptyActivityList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getEmptyActivitiesForCorrelation(correlationId: string): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    const restPath = ConsumerRestSettings.paths.correlationEmptyActivities
      .replace(ConsumerRestSettings.params.correlationId, correlationId);

    const url = this.applyBaseConsumerApiUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.EmptyActivities.EmptyActivityList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getEmptyActivitiesForProcessModelInCorrelation(
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    const restPath = ConsumerRestSettings.paths.processModelCorrelationEmptyActivities
      .replace(ConsumerRestSettings.params.processModelId, processModelId)
      .replace(ConsumerRestSettings.params.correlationId, correlationId);

    const url = this.applyBaseConsumerApiUrl(restPath);

    const httpResponse = await this.httpClient.get<DataModels.EmptyActivities.EmptyActivityList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getWaitingEmptyActivitiesByIdentity(identity: IIdentity): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    const url = this.applyBaseConsumerApiUrl(ConsumerRestSettings.paths.getOwnEmptyActivities);

    const httpResponse = await this.httpClient.get<DataModels.EmptyActivities.EmptyActivityList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async finishEmptyActivity(
    processInstanceId: string,
    correlationId: string,
    emptyActivityInstanceId: string,
  ): Promise<void> {
    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    let url = ConsumerRestSettings.paths.finishEmptyActivity
      .replace(ConsumerRestSettings.params.processInstanceId, processInstanceId)
      .replace(ConsumerRestSettings.params.correlationId, correlationId)
      .replace(ConsumerRestSettings.params.emptyActivityInstanceId, emptyActivityInstanceId);

    url = this.applyBaseConsumerApiUrl(url);

    const body: {} = {};
    await this.httpClient.post(url, body, requestAuthHeaders);
  }

  // UserTasks
  public async getUserTasksForProcessModel(processModelId: string): Promise<DataModels.UserTasks.UserTaskList> {
    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    let url = ConsumerRestSettings.paths.processModelUserTasks.replace(ConsumerRestSettings.params.processModelId, processModelId);
    url = this.applyBaseConsumerApiUrl(url);

    const httpResponse = await this.httpClient.get<DataModels.UserTasks.UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getUserTasksForProcessInstance(processInstanceId: string): Promise<DataModels.UserTasks.UserTaskList> {
    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    let url = ConsumerRestSettings.paths.processInstanceUserTasks.replace(ConsumerRestSettings.params.processInstanceId, processInstanceId);
    url = this.applyBaseConsumerApiUrl(url);

    const httpResponse = await this.httpClient.get<DataModels.UserTasks.UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getUserTasksForCorrelation(correlationId: string): Promise<DataModels.UserTasks.UserTaskList> {
    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    let url = ConsumerRestSettings.paths.correlationUserTasks.replace(ConsumerRestSettings.params.correlationId, correlationId);
    url = this.applyBaseConsumerApiUrl(url);

    const httpResponse = await this.httpClient.get<DataModels.UserTasks.UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getUserTasksForProcessModelInCorrelation(
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.UserTasks.UserTaskList> {
    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    let url = ConsumerRestSettings.paths.processModelCorrelationUserTasks
      .replace(ConsumerRestSettings.params.processModelId, processModelId)
      .replace(ConsumerRestSettings.params.correlationId, correlationId);

    url = this.applyBaseConsumerApiUrl(url);

    const httpResponse = await this.httpClient.get<DataModels.UserTasks.UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getWaitingUserTasksByIdentity(identity: IIdentity): Promise<DataModels.UserTasks.UserTaskList> {
    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    const urlRestPart = ConsumerRestSettings.paths.getOwnUserTasks;
    const url = this.applyBaseConsumerApiUrl(urlRestPart);

    const httpResponse = await this.httpClient.get<DataModels.UserTasks.UserTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async finishUserTask(
    processInstanceId: string,
    correlationId: string,
    userTaskInstanceId: string,
    userTaskResult: DataModels.UserTasks.UserTaskResult,
  ): Promise<void> {
    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    let url = ConsumerRestSettings.paths.finishUserTask
      .replace(ConsumerRestSettings.params.processInstanceId, processInstanceId)
      .replace(ConsumerRestSettings.params.correlationId, correlationId)
      .replace(ConsumerRestSettings.params.userTaskInstanceId, userTaskInstanceId);

    url = this.applyBaseConsumerApiUrl(url);

    await this.httpClient.post<DataModels.UserTasks.UserTaskResult, void>(url, userTaskResult, requestAuthHeaders);
  }

  // ManualTasks
  public async getManualTasksForProcessModel(processModelId: string): Promise<DataModels.ManualTasks.ManualTaskList> {
    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    const urlRestPart = ConsumerRestSettings.paths
      .processModelManualTasks
      .replace(ConsumerRestSettings.params.processModelId, processModelId);

    const url = this.applyBaseConsumerApiUrl(urlRestPart);

    const httpResponse = await this.httpClient.get<DataModels.ManualTasks.ManualTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getManualTasksForProcessInstance(processInstanceId: string): Promise<DataModels.ManualTasks.ManualTaskList> {
    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    const urlRestPart = ConsumerRestSettings.paths
      .processInstanceManualTasks
      .replace(ConsumerRestSettings.params.processInstanceId, processInstanceId);

    const url = this.applyBaseConsumerApiUrl(urlRestPart);

    const httpResponse = await this.httpClient.get<DataModels.ManualTasks.ManualTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getManualTasksForCorrelation(correlationId: string): Promise<DataModels.ManualTasks.ManualTaskList> {
    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    const urlRestPart = ConsumerRestSettings.paths
      .correlationManualTasks
      .replace(ConsumerRestSettings.params.correlationId, correlationId);

    const url = this.applyBaseConsumerApiUrl(urlRestPart);

    const httpResponse = await this.httpClient.get<DataModels.ManualTasks.ManualTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getManualTasksForProcessModelInCorrelation(
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.ManualTasks.ManualTaskList> {
    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    const urlRestPart = ConsumerRestSettings.paths.processModelCorrelationManualTasks
      .replace(ConsumerRestSettings.params.processModelId, processModelId)
      .replace(ConsumerRestSettings.params.correlationId, correlationId);

    const url = this.applyBaseConsumerApiUrl(urlRestPart);

    const httpResponse = await this.httpClient.get<DataModels.ManualTasks.ManualTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async getWaitingManualTasksByIdentity(identity: IIdentity): Promise<DataModels.ManualTasks.ManualTaskList> {
    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    const urlRestPart = ConsumerRestSettings.paths.getOwnManualTasks;
    const url = this.applyBaseConsumerApiUrl(urlRestPart);

    const httpResponse = await this.httpClient.get<DataModels.ManualTasks.ManualTaskList>(url, requestAuthHeaders);

    return httpResponse.result;
  }

  public async finishManualTask(
    processInstanceId: string,
    correlationId: string,
    manualTaskInstanceId: string,
  ): Promise<void> {
    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    const urlRestPart = ConsumerRestSettings.paths.finishManualTask
      .replace(ConsumerRestSettings.params.processInstanceId, processInstanceId)
      .replace(ConsumerRestSettings.params.correlationId, correlationId)
      .replace(ConsumerRestSettings.params.manualTaskInstanceId, manualTaskInstanceId);

    const url = this.applyBaseConsumerApiUrl(urlRestPart);

    const body: {} = {};
    await this.httpClient.post(url, body, requestAuthHeaders);
  }

  public async fetchAndLockExternalTasks<TPayloadType>(
    workerId: string,
    topicName: string,
    maxTasks: number,
    longPollingTimeout: number,
    lockDuration: number,
  ): Promise<Array<ExternalTask<TPayloadType>>> {

    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    let url = ExternalTaskRestSettings.paths.fetchAndLockExternalTasks;
    url = this.applyBaseExternalTaskUrl(url);

    const payload = new FetchAndLockRequestPayload(workerId, topicName, maxTasks, longPollingTimeout, lockDuration);

    const httpResponse = await this.httpClient.post<FetchAndLockRequestPayload, Array<ExternalTask<TPayloadType>>>(url, payload, requestAuthHeaders);

    return httpResponse.result;
  }

  public async extendLock(workerId: string, externalTaskId: string, additionalDuration: number): Promise<void> {

    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    let url = ExternalTaskRestSettings.paths.extendLock
      .replace(ExternalTaskRestSettings.params.externalTaskId, externalTaskId);

    url = this.applyBaseExternalTaskUrl(url);

    const payload = new ExtendLockRequestPayload(workerId, additionalDuration);

    await this.httpClient.post<ExtendLockRequestPayload, void>(url, payload, requestAuthHeaders);
  }

  public async handleBpmnError(workerId: string, externalTaskId: string, errorCode: string): Promise<void> {

    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    let url = ExternalTaskRestSettings.paths.handleBpmnError
      .replace(ExternalTaskRestSettings.params.externalTaskId, externalTaskId);

    url = this.applyBaseExternalTaskUrl(url);

    const payload = new HandleBpmnErrorRequestPayload(workerId, errorCode);

    await this.httpClient.post<HandleBpmnErrorRequestPayload, void>(url, payload, requestAuthHeaders);
  }

  public async handleServiceError(
    workerId: string,
    externalTaskId: string,
    errorMessage: string,
    errorDetails: string,
  ): Promise<void> {

    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    let url = ExternalTaskRestSettings.paths.handleServiceError
      .replace(ExternalTaskRestSettings.params.externalTaskId, externalTaskId);

    url = this.applyBaseExternalTaskUrl(url);

    const payload = new HandleServiceErrorRequestPayload(workerId, errorMessage, errorDetails);

    await this.httpClient.post<HandleServiceErrorRequestPayload, void>(url, payload, requestAuthHeaders);
  }

  public async finishExternalTask<TResultType>(workerId: string, externalTaskId: string, results: TResultType): Promise<void> {

    const requestAuthHeaders = this.createRequestAuthHeaders(this.identity);

    let url = ExternalTaskRestSettings.paths.finishExternalTask
      .replace(ExternalTaskRestSettings.params.externalTaskId, externalTaskId);

    url = this.applyBaseExternalTaskUrl(url);

    const payload = new FinishExternalTaskRequestPayload(workerId, results);

    await this.httpClient.post<FinishExternalTaskRequestPayload<TResultType>, void>(url, payload, requestAuthHeaders);
  }

  private createRequestAuthHeaders(identity: IIdentity): IRequestOptions {
    const noAuthTokenProvided = !identity || typeof identity.token !== 'string';
    if (noAuthTokenProvided) {
      return {};
    }

    const requestAuthHeaders = {
      headers: {
        Authorization: `Bearer ${identity.token}`,
      },
    };

    return requestAuthHeaders;
  }

  private applyBaseConsumerApiUrl(url: string): string {
    return `${this.baseConsumerApiUrl}${url}`;
  }

  private applyBaseExternalTaskUrl(url: string): string {
    return `${this.baseExternalTaskApiUrl}${url}`;
  }

  private createSocketIoSubscription(route: string, callback: any, subscribeOnce: boolean): Subscription {

    this.createSocketForIdentity();

    if (subscribeOnce) {
      this.socketForIdentity.once(route, callback);
    } else {
      this.socketForIdentity.on(route, callback);
    }

    const subscriptionId = uuid.v4();
    const subscription = new Subscription(subscriptionId, route, subscribeOnce);

    this.subscriptionCollection[subscriptionId] = callback;

    return subscription;
  }

  private createSocketForIdentity(): void {

    const existingSocket = this.socketForIdentity !== undefined;
    if (existingSocket) {
      return;
    }

    const noAuthTokenProvided = !this.identity || typeof this.identity.token !== 'string';
    if (noAuthTokenProvided) {
      throw new UnauthorizedError('No auth token provided!');
    }

    const socketUrl = `${this.processEngineUrl}/${socketSettings.namespace}`;
    const socketIoOptions: SocketIOClient.ConnectOpts = {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: this.identity.token,
          },
        },
      },
    };

    this.socketForIdentity = io(socketUrl, socketIoOptions);
  }

  private removeSocketForIdentity(): void {
    const noSocketFound = !this.socketForIdentity;
    if (noSocketFound) {
      return;
    }
    this.socketForIdentity.disconnect();
    this.socketForIdentity.close();

    this.socketForIdentity = undefined;
  }

}
