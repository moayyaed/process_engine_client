import {Subscription} from '@essential-projects/event_aggregator_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {
  DataModels,
  IConsumerApi,
  Messages,
} from '@process-engine/consumer_api_contracts';
import {
  ExternalTask,
  IExternalTaskApi,
} from '@process-engine/external_task_api_contracts';

export class ProcessEngineInternalClient {

  private readonly consumerApiService: IConsumerApi;
  private readonly externalApiService: IExternalTaskApi;
  private readonly identity: IIdentity;

  private readonly dummyIdentity: IIdentity = {
    token: 'ZHVtbXlfdG9rZW4=',
    userId: 'dummy_token',
  }

  constructor(consumerApiService: IConsumerApi, externalApiService: IExternalTaskApi, identity?: IIdentity) {
    this.consumerApiService = consumerApiService;
    this.externalApiService = externalApiService;
    this.identity = identity || this.dummyIdentity;
  }

  // Notifications
  public async onActivityReached(
    callback: Messages.CallbackTypes.OnActivityReachedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onActivityReached(this.identity, callback, subscribeOnce);
  }

  public async onActivityFinished(
    callback: Messages.CallbackTypes.OnActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onActivityFinished(this.identity, callback, subscribeOnce);
  }

  // ------------ For backwards compatibility only
  public async onCallActivityWaiting(
    callback: Messages.CallbackTypes.OnCallActivityWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onCallActivityWaiting(this.identity, callback, subscribeOnce);
  }

  public async onCallActivityFinished(
    callback: Messages.CallbackTypes.OnCallActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onCallActivityFinished(this.identity, callback, subscribeOnce);
  }
  // ------------

  public async onEmptyActivityWaiting(
    callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onEmptyActivityWaiting(this.identity, callback, subscribeOnce);
  }

  public async onEmptyActivityFinished(
    callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onEmptyActivityFinished(this.identity, callback, subscribeOnce);
  }

  public async onEmptyActivityForIdentityWaiting(
    callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onEmptyActivityForIdentityWaiting(this.identity, callback, subscribeOnce);
  }

  public async onEmptyActivityForIdentityFinished(
    callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onEmptyActivityForIdentityFinished(this.identity, callback, subscribeOnce);
  }

  public async onUserTaskWaiting(
    callback: Messages.CallbackTypes.OnUserTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onUserTaskWaiting(this.identity, callback, subscribeOnce);
  }

  public async onUserTaskFinished(
    callback: Messages.CallbackTypes.OnUserTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onUserTaskFinished(this.identity, callback, subscribeOnce);
  }

  public async onUserTaskForIdentityWaiting(
    callback: Messages.CallbackTypes.OnUserTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onUserTaskForIdentityWaiting(this.identity, callback, subscribeOnce);
  }

  public async onUserTaskForIdentityFinished(
    callback: Messages.CallbackTypes.OnUserTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onUserTaskForIdentityFinished(this.identity, callback, subscribeOnce);
  }

  public async onBoundaryEventTriggered(
    callback: Messages.CallbackTypes.OnBoundaryEventTriggeredCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onBoundaryEventTriggered(this.identity, callback, subscribeOnce);
  }

  public async onIntermediateThrowEventTriggered(
    callback: Messages.CallbackTypes.OnIntermediateThrowEventTriggeredCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onIntermediateThrowEventTriggered(this.identity, callback, subscribeOnce);
  }

  public async onIntermediateCatchEventReached(
    callback: Messages.CallbackTypes.OnIntermediateCatchEventReachedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onIntermediateCatchEventReached(this.identity, callback, subscribeOnce);
  }

  public async onIntermediateCatchEventFinished(
    callback: Messages.CallbackTypes.OnIntermediateCatchEventFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onIntermediateCatchEventFinished(this.identity, callback, subscribeOnce);
  }

  public async onManualTaskWaiting(
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onManualTaskWaiting(this.identity, callback, subscribeOnce);
  }

  public async onManualTaskFinished(
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onManualTaskFinished(this.identity, callback, subscribeOnce);
  }

  public async onManualTaskForIdentityWaiting(
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onManualTaskForIdentityWaiting(this.identity, callback, subscribeOnce);
  }

  public async onManualTaskForIdentityFinished(
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onManualTaskForIdentityFinished(this.identity, callback, subscribeOnce);
  }

  public async onProcessStarted(
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onProcessStarted(this.identity, callback, subscribeOnce);
  }

  public async onProcessWithProcessModelIdStarted(
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    processModelId: string,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onProcessWithProcessModelIdStarted(this.identity, callback, processModelId, subscribeOnce);
  }

  public async onProcessTerminated(
    callback: Messages.CallbackTypes.OnProcessTerminatedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onProcessTerminated(this.identity, callback, subscribeOnce);
  }

  public async onProcessError(
    callback: Messages.CallbackTypes.OnProcessErrorCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onProcessError(this.identity, callback, subscribeOnce);
  }

  public async onProcessEnded(
    callback: Messages.CallbackTypes.OnProcessEndedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onProcessEnded(this.identity, callback, subscribeOnce);
  }

  public async removeSubscription(subscription: Subscription): Promise<void> {
    return this.consumerApiService.removeSubscription(this.identity, subscription);
  }

  // Process models and instances
  public async getProcessModels(identity: IIdentity): Promise<DataModels.ProcessModels.ProcessModelList> {
    return this.consumerApiService.getProcessModels(identity);
  }

  public async getProcessModelById(processModelId: string): Promise<DataModels.ProcessModels.ProcessModel> {
    return this.consumerApiService.getProcessModelById(this.identity, processModelId);
  }

  public async getProcessModelByProcessInstanceId(processInstanceId: string): Promise<DataModels.ProcessModels.ProcessModel> {
    return this.consumerApiService.getProcessModelByProcessInstanceId(this.identity, processInstanceId);
  }

  public async startProcessInstance(
    processModelId: string,
    payload: DataModels.ProcessModels.ProcessStartRequestPayload,
    startCallbackType?: DataModels.ProcessModels.StartCallbackType,
    startEventId?: string,
    endEventId?: string,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload> {
    return this.consumerApiService.startProcessInstance(this.identity, processModelId, payload, startCallbackType, startEventId, endEventId);
  }

  public async getProcessResultForCorrelation(
    correlationId: string,
    processModelId: string,
  ): Promise<Array<DataModels.CorrelationResult>> {
    return this.consumerApiService.getProcessResultForCorrelation(this.identity, correlationId, processModelId);
  }

  public async getProcessInstancesByIdentity(identity: IIdentity): Promise<Array<DataModels.ProcessInstance>> {
    return this.consumerApiService.getProcessInstancesByIdentity(identity);
  }

  // Events
  public async getEventsForProcessModel(processModelId: string): Promise<DataModels.Events.EventList> {
    return this.consumerApiService.getEventsForProcessModel(this.identity, processModelId);
  }

  public async getEventsForCorrelation(correlationId: string): Promise<DataModels.Events.EventList> {
    return this.consumerApiService.getEventsForCorrelation(this.identity, correlationId);
  }

  public async getEventsForProcessModelInCorrelation(
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.Events.EventList> {
    return this.consumerApiService.getEventsForProcessModelInCorrelation(this.identity, processModelId, correlationId);
  }

  public async triggerMessageEvent(messageName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {
    return this.consumerApiService.triggerMessageEvent(this.identity, messageName, payload);
  }

  public async triggerSignalEvent(signalName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {
    return this.consumerApiService.triggerSignalEvent(this.identity, signalName, payload);
  }

  // Empty Activities
  public async getEmptyActivitiesForProcessModel(processModelId: string): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    return this.consumerApiService.getEmptyActivitiesForProcessModel(this.identity, processModelId);
  }

  public async getEmptyActivitiesForProcessInstance(processInstanceId: string): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    return this.consumerApiService.getEmptyActivitiesForProcessInstance(this.identity, processInstanceId);
  }

  public async getEmptyActivitiesForCorrelation(correlationId: string): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    return this.consumerApiService.getEmptyActivitiesForCorrelation(this.identity, correlationId);
  }

  public async getEmptyActivitiesForProcessModelInCorrelation(
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    return this.consumerApiService.getEmptyActivitiesForProcessModelInCorrelation(this.identity, processModelId, correlationId);
  }

  public async getWaitingEmptyActivitiesByIdentity(identity: IIdentity): Promise<DataModels.EmptyActivities.EmptyActivityList> {
    return this.consumerApiService.getWaitingEmptyActivitiesByIdentity(identity);
  }

  public async finishEmptyActivity(
    processInstanceId: string,
    correlationId: string,
    emptyActivityInstanceId: string,
  ): Promise<void> {
    return this.consumerApiService.finishEmptyActivity(this.identity, processInstanceId, correlationId, emptyActivityInstanceId);
  }

  // UserTasks
  public async getUserTasksForProcessModel(processModelId: string): Promise<DataModels.UserTasks.UserTaskList> {
    return this.consumerApiService.getUserTasksForProcessModel(this.identity, processModelId);
  }

  public async getUserTasksForProcessInstance(processInstanceId: string): Promise<DataModels.UserTasks.UserTaskList> {
    return this.consumerApiService.getUserTasksForProcessInstance(this.identity, processInstanceId);
  }

  public async getUserTasksForCorrelation(correlationId: string): Promise<DataModels.UserTasks.UserTaskList> {
    return this.consumerApiService.getUserTasksForCorrelation(this.identity, correlationId);
  }

  public async getUserTasksForProcessModelInCorrelation(
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.UserTasks.UserTaskList> {
    return this.consumerApiService.getUserTasksForProcessModelInCorrelation(this.identity, processModelId, correlationId);
  }

  public async getWaitingUserTasksByIdentity(identity: IIdentity): Promise<DataModels.UserTasks.UserTaskList> {
    return this.consumerApiService.getWaitingUserTasksByIdentity(identity);
  }

  public async finishUserTask(
    processInstanceId: string,
    correlationId: string,
    userTaskInstanceId: string,
    userTaskResult: DataModels.UserTasks.UserTaskResult,
  ): Promise<void> {
    return this.consumerApiService.finishUserTask(this.identity, processInstanceId, correlationId, userTaskInstanceId, userTaskResult);
  }

  // ManualTasks
  public async getManualTasksForProcessModel(processModelId: string): Promise<DataModels.ManualTasks.ManualTaskList> {
    return this.consumerApiService.getManualTasksForProcessModel(this.identity, processModelId);
  }

  public async getManualTasksForProcessInstance(processInstanceId: string): Promise<DataModels.ManualTasks.ManualTaskList> {
    return this.consumerApiService.getManualTasksForProcessInstance(this.identity, processInstanceId);
  }

  public async getManualTasksForCorrelation(correlationId: string): Promise<DataModels.ManualTasks.ManualTaskList> {
    return this.consumerApiService.getManualTasksForCorrelation(this.identity, correlationId);
  }

  public async getManualTasksForProcessModelInCorrelation(
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.ManualTasks.ManualTaskList> {
    return this.consumerApiService.getManualTasksForProcessModelInCorrelation(this.identity, processModelId, correlationId);
  }

  public async getWaitingManualTasksByIdentity(identity: IIdentity): Promise<DataModels.ManualTasks.ManualTaskList> {
    return this.consumerApiService.getWaitingManualTasksByIdentity(identity);
  }

  public async finishManualTask(
    processInstanceId: string,
    correlationId: string,
    manualTaskInstanceId: string,
  ): Promise<void> {
    return this.consumerApiService.finishManualTask(this.identity, processInstanceId, correlationId, manualTaskInstanceId);
  }

  // ExternalTasks
  public async fetchAndLockExternalTasks<TPayloadType>(
    workerId: string,
    topicName: string,
    maxTasks: number,
    longPollingTimeout: number,
    lockDuration: number,
  ): Promise<Array<ExternalTask<TPayloadType>>> {
    return this
      .externalApiService
      .fetchAndLockExternalTasks<TPayloadType>(this.identity, workerId, topicName, maxTasks, longPollingTimeout, lockDuration);
  }

  public async extendLock(workerId: string, externalTaskId: string, additionalDuration: number): Promise<void> {
    return this.externalApiService.extendLock(this.identity, workerId, externalTaskId, additionalDuration);
  }

  public async handleBpmnError(workerId: string, externalTaskId: string, errorCode: string): Promise<void> {
    return this.externalApiService.handleBpmnError(this.identity, workerId, externalTaskId, errorCode);
  }

  public async handleServiceError(
    workerId: string,
    externalTaskId: string,
    errorMessage: string,
    errorDetails: string,
  ): Promise<void> {
    return this.externalApiService.handleServiceError(this.identity, workerId, externalTaskId, errorMessage, errorDetails);
  }

  public async finishExternalTask<TResultType>(
    workerId: string,
    externalTaskId: string,
    payload: TResultType,
  ): Promise<void> {
    return this.externalApiService.finishExternalTask(this.identity, workerId, externalTaskId, payload);
  }

}
