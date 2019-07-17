import {Subscription} from '@essential-projects/event_aggregator_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

export interface IProcessEngineClient {

  initialize(): void;

  dispose(): void;

  // Process models and instances
  getProcessModels(): Promise<DataModels.ProcessModels.ProcessModelList>;

  getProcessModelById(processModelId: string): Promise<DataModels.ProcessModels.ProcessModel>;

  getProcessModelByProcessInstanceId(processInstanceId: string): Promise<DataModels.ProcessModels.ProcessModel>;

  startProcessInstance(
    processModelId: string,
    startEventId: string,
    payload?: DataModels.ProcessModels.ProcessStartRequestPayload,
    startCallbackType?: DataModels.ProcessModels.StartCallbackType,
    endEventId?: string,
  ): Promise<DataModels.ProcessModels.ProcessStartResponsePayload>;

  getResultForProcessModelInCorrelation(correlationId: string, processModelId: string): Promise<Array<DataModels.CorrelationResult>>;

  getProcessInstancesForClientIdentity(): Promise<Array<DataModels.ProcessInstance>>;

  // Events
  getSuspendedEventsForProcessModel(processModelId: string): Promise<DataModels.Events.EventList>;

  getSuspendedEventsForCorrelation(correlationId: string): Promise<DataModels.Events.EventList>;

  getSuspendedEventsForProcessModelInCorrelation(processModelId: string, correlationId: string): Promise<DataModels.Events.EventList>;

  triggerMessageEvent(messageName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void>;

  triggerSignalEvent(signalName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void>;

  // Empty Activities
  getSuspendedEmptyActivitiesForProcessModel(processModelId: string): Promise<DataModels.EmptyActivities.EmptyActivityList>;

  getSuspendedEmptyActivitiesForProcessInstance(processInstanceId: string): Promise<DataModels.EmptyActivities.EmptyActivityList>;

  getSuspendedEmptyActivitiesForCorrelation(correlationId: string): Promise<DataModels.EmptyActivities.EmptyActivityList>;

  getSuspendedEmptyActivitiesForProcessModelInCorrelation(
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.EmptyActivities.EmptyActivityList>;

  getSuspendedEmptyActivitiesByIdentity(identity: IIdentity): Promise<DataModels.EmptyActivities.EmptyActivityList>;

  finishEmptyActivity(
    processInstanceId: string,
    correlationId: string,
    emptyActivityInstanceId: string,
  ): Promise<void>;

  // UserTasks
  getSuspendedUserTasksForProcessModel(processModelId: string): Promise<DataModels.UserTasks.UserTaskList>;

  getSuspendedUserTasksForProcessInstance(processInstanceId: string): Promise<DataModels.UserTasks.UserTaskList>;

  getSuspendedUserTasksForCorrelation(correlationId: string): Promise<DataModels.UserTasks.UserTaskList>;

  getSuspendedUserTasksForProcessModelInCorrelation(
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.UserTasks.UserTaskList>;

  getSuspendedUserTasksForClientIdentity(identity: IIdentity): Promise<DataModels.UserTasks.UserTaskList>;

  finishUserTask(
    processInstanceId: string,
    correlationId: string,
    userTaskInstanceId: string,
    userTaskResult: DataModels.UserTasks.UserTaskResult,
  ): Promise<void>;

  // ManualTasks
  getSuspendedManualTasksForProcessModel(processModelId: string): Promise<DataModels.ManualTasks.ManualTaskList>;

  getSuspendedManualTasksForProcessInstance(processInstanceId: string): Promise<DataModels.ManualTasks.ManualTaskList>;

  getSuspendedManualTasksForCorrelation(correlationId: string): Promise<DataModels.ManualTasks.ManualTaskList>;

  getSuspendedManualTasksForProcessModelInCorrelation(
    processModelId: string,
    correlationId: string,
  ): Promise<DataModels.ManualTasks.ManualTaskList>;

  getSuspendedManualTasksForClientIdentity(): Promise<DataModels.ManualTasks.ManualTaskList>;

  finishManualTask(
    processInstanceId: string,
    correlationId: string,
    manualTaskInstanceId: string,
  ): Promise<void>;

  fetchAndLockExternalTasks<TPayloadType>(
    workerId: string,
    topicName: string,
    maxTasks: number,
    longPollingTimeout: number,
    lockDuration: number,
  ): Promise<Array<ExternalTask<TPayloadType>>>;

  extendExternalTaskLock(workerId: string, externalTaskId: string, additionalDuration: number): Promise<void>;

  handleExternalTaskBpmnError(workerId: string, externalTaskId: string, errorCode: string): Promise<void>;

  handleExternalTaskServiceError(
    workerId: string,
    externalTaskId: string,
    errorMessage: string,
    errorDetails: string,
  ): Promise<void> ;

  finishExternalTask<TResultType>(workerId: string, externalTaskId: string, results: TResultType): Promise<void>;

  // Notifications
  onActivityReached(callback: Messages.CallbackTypes.OnActivityReachedCallback, subscribeOnce?: boolean): Promise<any>;

  onActivityFinished(callback: Messages.CallbackTypes.OnActivityFinishedCallback, subscribeOnce?: boolean): Promise<any>;

  // ------------ For backwards compatibility only
  onCallActivityWaiting(callback: Messages.CallbackTypes.OnCallActivityWaitingCallback, subscribeOnce?: boolean): Promise<any>;

  onCallActivityFinished(callback: Messages.CallbackTypes.OnCallActivityFinishedCallback, subscribeOnce?: boolean): Promise<any>;
  // ------------

  onEmptyActivityWaiting(callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onEmptyActivityFinished(callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onEmptyActivityForIdentityWaiting(callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onEmptyActivityForIdentityFinished(callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onUserTaskWaiting(callback: Messages.CallbackTypes.OnUserTaskWaitingCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onUserTaskFinished(callback: Messages.CallbackTypes.OnUserTaskFinishedCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onBoundaryEventTriggered(callback: Messages.CallbackTypes.OnBoundaryEventTriggeredCallback, subscribeOnce?: boolean): Promise<any>;

  onIntermediateThrowEventTriggered(callback: Messages.CallbackTypes.OnIntermediateThrowEventTriggeredCallback, subscribeOnce?: boolean): Promise<any>;

  onIntermediateCatchEventReached(callback: Messages.CallbackTypes.OnIntermediateCatchEventReachedCallback, subscribeOnce?: boolean): Promise<any>;

  onIntermediateCatchEventFinished(callback: Messages.CallbackTypes.OnIntermediateCatchEventFinishedCallback, subscribeOnce?: boolean): Promise<any>;

  onUserTaskForIdentityWaiting(callback: Messages.CallbackTypes.OnUserTaskWaitingCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onUserTaskForIdentityFinished(callback: Messages.CallbackTypes.OnUserTaskFinishedCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onProcessTerminated(callback: Messages.CallbackTypes.OnProcessTerminatedCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onProcessError(callback: Messages.CallbackTypes.OnProcessErrorCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onProcessStarted(callback: Messages.CallbackTypes.OnProcessStartedCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onProcessWithProcessModelIdStarted(callback: Messages.CallbackTypes.OnProcessStartedCallback, processModelId: string, subscribeOnce?: boolean): Promise<Subscription>;

  onManualTaskWaiting(callback: Messages.CallbackTypes.OnManualTaskWaitingCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onManualTaskFinished(callback: Messages.CallbackTypes.OnManualTaskFinishedCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onManualTaskForIdentityWaiting(callback: Messages.CallbackTypes.OnManualTaskWaitingCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onManualTaskForIdentityFinished(callback: Messages.CallbackTypes.OnManualTaskFinishedCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onProcessEnded(callback: Messages.CallbackTypes.OnProcessEndedCallback, subscribeOnce?: boolean): Promise<Subscription>;

  removeSubscription(subscription: Subscription): Promise<void>;

}
