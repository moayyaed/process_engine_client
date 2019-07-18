import {Subscription} from '@essential-projects/event_aggregator_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';
import {DataModels, Messages} from '@process-engine/consumer_api_contracts';
import {HandleExternalTaskAction} from '@process-engine/external_task_api_contracts';

import {ExternalTaskWorker} from '../external_task_worker';

export interface IProcessEngineClient {

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

  getSuspendedEmptyActivitiesForClientIdentity(): Promise<DataModels.EmptyActivities.EmptyActivityList>;

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

  // ExternalTasks
  subscribeToExternalTasksWithTopic<TPayload>(
    topic: string,
    handleAction: HandleExternalTaskAction<TPayload>,
    maxTasks?: number,
    timeout?: number,
  ): ExternalTaskWorker;

  // Notifications
  onActivityReached(callback: Messages.CallbackTypes.OnActivityReachedCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onActivityFinished(callback: Messages.CallbackTypes.OnActivityFinishedCallback, subscribeOnce?: boolean): Promise<Subscription>;

  // ------------ For backwards compatibility only
  onCallActivityWaiting(callback: Messages.CallbackTypes.OnCallActivityWaitingCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onCallActivityFinished(callback: Messages.CallbackTypes.OnCallActivityFinishedCallback, subscribeOnce?: boolean): Promise<Subscription>;
  // ------------

  onEmptyActivityWaiting(callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onEmptyActivityFinished(callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onEmptyActivityForIdentityWaiting(callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onEmptyActivityForIdentityFinished(
    callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription>;

  onUserTaskWaiting(callback: Messages.CallbackTypes.OnUserTaskWaitingCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onUserTaskFinished(callback: Messages.CallbackTypes.OnUserTaskFinishedCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onBoundaryEventTriggered(callback: Messages.CallbackTypes.OnBoundaryEventTriggeredCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onIntermediateThrowEventTriggered(
    callback: Messages.CallbackTypes.OnIntermediateThrowEventTriggeredCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription>;

  onIntermediateCatchEventReached(
    callback: Messages.CallbackTypes.OnIntermediateCatchEventReachedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription>;

  onIntermediateCatchEventFinished(
    callback: Messages.CallbackTypes.OnIntermediateCatchEventFinishedCallback,
    subscribeOnce?: boolean,
  ): Promise<Subscription>;

  onUserTaskForIdentityWaiting(callback: Messages.CallbackTypes.OnUserTaskWaitingCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onUserTaskForIdentityFinished(callback: Messages.CallbackTypes.OnUserTaskFinishedCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onProcessTerminated(callback: Messages.CallbackTypes.OnProcessTerminatedCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onProcessError(callback: Messages.CallbackTypes.OnProcessErrorCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onProcessStarted(callback: Messages.CallbackTypes.OnProcessStartedCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onProcessWithProcessModelIdStarted(
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    processModelId: string,
    subscribeOnce?: boolean,
  ): Promise<Subscription>;

  onManualTaskWaiting(callback: Messages.CallbackTypes.OnManualTaskWaitingCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onManualTaskFinished(callback: Messages.CallbackTypes.OnManualTaskFinishedCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onManualTaskForIdentityWaiting(callback: Messages.CallbackTypes.OnManualTaskWaitingCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onManualTaskForIdentityFinished(callback: Messages.CallbackTypes.OnManualTaskFinishedCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onProcessEnded(callback: Messages.CallbackTypes.OnProcessEndedCallback, subscribeOnce?: boolean): Promise<Subscription>;

  removeSubscription(subscription: Subscription): Promise<void>;

}
