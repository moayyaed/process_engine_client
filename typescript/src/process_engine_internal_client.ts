import {Subscription} from '@essential-projects/event_aggregator_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {
  APIs,
  DataModels,
  HandleExternalTaskAction,
  Messages,
} from '@process-engine/consumer_api_contracts';
import {ExternalTaskWorker} from '@process-engine/consumer_api_client';

import {Interfaces, Types} from './contracts/index';

export class ProcessEngineInternalClient implements Interfaces.IProcessEngineClient {

  private emptyActivityService: APIs.IEmptyActivityConsumerApi;
  private eventService: APIs.IEventConsumerApi;
  private manualTaskService: APIs.IManualTaskConsumerApi;
  private notificationService: APIs.INotificationConsumerApi;
  private processModelService: APIs.IProcessModelConsumerApi;
  private userTaskService: APIs.IUserTaskConsumerApi;
  private readonly identity: IIdentity;

  private readonly dummyIdentity: IIdentity = {
    token: 'ZHVtbXlfdG9rZW4=',
    userId: 'dummy_token',
  }

  constructor(
    emptyActivityService: APIs.IEmptyActivityConsumerApi,
    eventService: APIs.IEventConsumerApi,
    manualTaskService: APIs.IManualTaskConsumerApi,
    notificationService: APIs.INotificationConsumerApi,
    processModelService: APIs.IProcessModelConsumerApi,
    userTaskService: APIs.IUserTaskConsumerApi,
    identity?: IIdentity,
  ) {
    this.emptyActivityService = emptyActivityService;
    this.eventService = eventService;
    this.manualTaskService = manualTaskService;
    this.notificationService = notificationService;
    this.processModelService = processModelService;
    this.userTaskService = userTaskService;
    this.identity = identity || this.dummyIdentity;
  }

  // Process models and instances
  public async getProcessModels(): Promise<Array<DataModels.ProcessModels.ProcessModel>> {
    const result = await this.processModelService.getProcessModels(this.identity);
    return result.processModels;
  }

  public async getProcessModelById(processModelId: string): Promise<DataModels.ProcessModels.ProcessModel> {
    return this.processModelService.getProcessModelById(this.identity, processModelId);
  }

  public async getProcessModelByProcessInstanceId(processInstanceId: string): Promise<DataModels.ProcessModels.ProcessModel> {
    return this.processModelService.getProcessModelByProcessInstanceId(this.identity, processInstanceId);
  }

  public async startProcessInstance<TRequestPayload, TResponsePayload>(
    processModelId: string,
    startEventId: string,
    requestParams?: Types.ProcessStartRequest<TRequestPayload>,
    startCallbackType?: DataModels.ProcessModels.StartCallbackType,
    endEventId?: string,
  ): Promise<Types.ProcessStartResponse<TResponsePayload>> {

    const buildPayloadForProcessEngine = (): DataModels.ProcessModels.ProcessStartRequestPayload => {
      const internalPayload = new DataModels.ProcessModels.ProcessStartRequestPayload();
      internalPayload.callerId = requestParams.parentProcessInstanceId;
      internalPayload.correlationId = requestParams.correlationId;
      internalPayload.inputValues = requestParams.payload;

      return internalPayload;
    };

    const internalPayload = requestParams !== undefined
      ? buildPayloadForProcessEngine()
      : {} as DataModels.ProcessModels.ProcessStartRequestPayload;

    const response = await this
      .processModelService
      .startProcessInstance(this.identity, processModelId, internalPayload, startCallbackType, startEventId, endEventId);

    const publicResponse = new Types.ProcessStartResponse<TResponsePayload>(
      response.correlationId,
      response.processInstanceId,
      response.endEventId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response.tokenPayload as any, // TODO: Can't cast to ProcessStartResponse, because tokenPayload is of type string!?
    );

    return publicResponse;
  }

  public async getResultForProcessModelInCorrelation(
    correlationId: string,
    processModelId: string,
  ): Promise<DataModels.Correlations.CorrelationResultList> {
    return this.processModelService.getProcessResultForCorrelation(this.identity, correlationId, processModelId);
  }

  public async getProcessInstancesForClientIdentity(): Promise<DataModels.ProcessModels.ProcessInstanceList> {
    return this.processModelService.getProcessInstancesByIdentity(this.identity);
  }

  // Empty Activities
  public async getSuspendedEmptyActivitiesForProcessModel(processModelId: string): Promise<Array<DataModels.EmptyActivities.EmptyActivity>> {
    const result = await this.emptyActivityService.getEmptyActivitiesForProcessModel(this.identity, processModelId);
    return result.emptyActivities;
  }

  public async getSuspendedEmptyActivitiesForProcessInstance(processInstanceId: string): Promise<Array<DataModels.EmptyActivities.EmptyActivity>> {
    const result = await this.emptyActivityService.getEmptyActivitiesForProcessInstance(this.identity, processInstanceId);
    return result.emptyActivities;
  }

  public async getSuspendedEmptyActivitiesForCorrelation(correlationId: string): Promise<Array<DataModels.EmptyActivities.EmptyActivity>> {
    const result = await this.emptyActivityService.getEmptyActivitiesForCorrelation(this.identity, correlationId);
    return result.emptyActivities;
  }

  public async getSuspendedEmptyActivitiesForProcessModelInCorrelation(
    processModelId: string,
    correlationId: string,
  ): Promise<Array<DataModels.EmptyActivities.EmptyActivity>> {
    const result = await this.emptyActivityService.getEmptyActivitiesForProcessModelInCorrelation(this.identity, processModelId, correlationId);
    return result.emptyActivities;
  }

  public async getSuspendedEmptyActivitiesForClientIdentity(): Promise<Array<DataModels.EmptyActivities.EmptyActivity>> {
    const result = await this.emptyActivityService.getWaitingEmptyActivitiesByIdentity(this.identity);
    return result.emptyActivities;
  }

  public async finishEmptyActivity(
    processInstanceId: string,
    correlationId: string,
    emptyActivityInstanceId: string,
  ): Promise<void> {
    return this.emptyActivityService.finishEmptyActivity(this.identity, processInstanceId, correlationId, emptyActivityInstanceId);
  }

  // Events
  public async getSuspendedEventsForProcessModel(processModelId: string): Promise<Array<DataModels.Events.Event>> {
    const result = await this.eventService.getEventsForProcessModel(this.identity, processModelId);
    return result.events;
  }

  public async getSuspendedEventsForCorrelation(correlationId: string): Promise<Array<DataModels.Events.Event>> {
    const result = await this.eventService.getEventsForCorrelation(this.identity, correlationId);
    return result.events;
  }

  public async getSuspendedEventsForProcessModelInCorrelation(
    processModelId: string,
    correlationId: string,
  ): Promise<Array<DataModels.Events.Event>> {
    const result = await this.eventService.getEventsForProcessModelInCorrelation(this.identity, processModelId, correlationId);
    return result.events;
  }

  public async triggerMessageEvent(messageName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {
    return this.eventService.triggerMessageEvent(this.identity, messageName, payload);
  }

  public async triggerSignalEvent(signalName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {
    return this.eventService.triggerSignalEvent(this.identity, signalName, payload);
  }

  // ManualTasks
  public async getSuspendedManualTasksForProcessModel(processModelId: string): Promise<Array<DataModels.ManualTasks.ManualTask>> {
    const result = await this.manualTaskService.getManualTasksForProcessModel(this.identity, processModelId);
    return result.manualTasks;
  }

  public async getSuspendedManualTasksForProcessInstance(processInstanceId: string): Promise<Array<DataModels.ManualTasks.ManualTask>> {
    const result = await this.manualTaskService.getManualTasksForProcessInstance(this.identity, processInstanceId);
    return result.manualTasks;
  }

  public async getSuspendedManualTasksForCorrelation(correlationId: string): Promise<Array<DataModels.ManualTasks.ManualTask>> {
    const result = await this.manualTaskService.getManualTasksForCorrelation(this.identity, correlationId);
    return result.manualTasks;
  }

  public async getSuspendedManualTasksForProcessModelInCorrelation(
    processModelId: string,
    correlationId: string,
  ): Promise<Array<DataModels.ManualTasks.ManualTask>> {
    const result = await this.manualTaskService.getManualTasksForProcessModelInCorrelation(this.identity, processModelId, correlationId);
    return result.manualTasks;
  }

  public async getSuspendedManualTasksForClientIdentity(): Promise<Array<DataModels.ManualTasks.ManualTask>> {
    const result = await this.manualTaskService.getWaitingManualTasksByIdentity(this.identity);
    return result.manualTasks;
  }

  public async finishManualTask(
    processInstanceId: string,
    correlationId: string,
    manualTaskInstanceId: string,
  ): Promise<void> {
    return this.manualTaskService.finishManualTask(this.identity, processInstanceId, correlationId, manualTaskInstanceId);
  }

  // UserTasks
  public async getSuspendedUserTasksForProcessModel(processModelId: string): Promise<Array<DataModels.UserTasks.UserTask>> {
    const result = await this.userTaskService.getUserTasksForProcessModel(this.identity, processModelId);
    return result.userTasks;
  }

  public async getSuspendedUserTasksForProcessInstance(processInstanceId: string): Promise<Array<DataModels.UserTasks.UserTask>> {
    const result = await this.userTaskService.getUserTasksForProcessInstance(this.identity, processInstanceId);
    return result.userTasks;
  }

  public async getSuspendedUserTasksForCorrelation(correlationId: string): Promise<Array<DataModels.UserTasks.UserTask>> {
    const result = await this.userTaskService.getUserTasksForCorrelation(this.identity, correlationId);
    return result.userTasks;
  }

  public async getSuspendedUserTasksForProcessModelInCorrelation(
    processModelId: string,
    correlationId: string,
  ): Promise<Array<DataModels.UserTasks.UserTask>> {
    const result = await this.userTaskService.getUserTasksForProcessModelInCorrelation(this.identity, processModelId, correlationId);
    return result.userTasks;
  }

  public async getSuspendedUserTasksForClientIdentity(): Promise<Array<DataModels.UserTasks.UserTask>> {
    const result = await this.userTaskService.getWaitingUserTasksByIdentity(this.identity);
    return result.userTasks;
  }

  public async finishUserTask(
    processInstanceId: string,
    correlationId: string,
    userTaskInstanceId: string,
    userTaskResult: DataModels.UserTasks.UserTaskResult,
  ): Promise<void> {
    return this.userTaskService.finishUserTask(this.identity, processInstanceId, correlationId, userTaskInstanceId, userTaskResult);
  }

  // ExternalTasks
  public subscribeToExternalTasksWithTopic<TPayload, TResult>(
    topic: string,
    callback: HandleExternalTaskAction<TPayload, TResult>,
    maxTasks: number = 10,
    timeout: number = 1000,
    processEngineUrl: string = 'http://localhost:8000',
  ): ExternalTaskWorker<TPayload, TResult> {
    const externalTaskWorker = new ExternalTaskWorker<TPayload, TResult>(processEngineUrl, this.identity, topic, maxTasks, timeout, callback);

    externalTaskWorker.start();

    return externalTaskWorker;
  }

  // Notifications
  public async onEmptyActivityWaiting(
    callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.notificationService.onEmptyActivityWaiting(this.identity, callback, subscribeOnce);
  }

  public async onEmptyActivityFinished(
    callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.notificationService.onEmptyActivityFinished(this.identity, callback, subscribeOnce);
  }

  public async onManualTaskWaiting(
    callback: Messages.CallbackTypes.OnManualTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.notificationService.onManualTaskWaiting(this.identity, callback, subscribeOnce);
  }

  public async onManualTaskFinished(
    callback: Messages.CallbackTypes.OnManualTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.notificationService.onManualTaskFinished(this.identity, callback, subscribeOnce);
  }

  public async onUserTaskWaiting(
    callback: Messages.CallbackTypes.OnUserTaskWaitingCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.notificationService.onUserTaskWaiting(this.identity, callback, subscribeOnce);
  }

  public async onUserTaskFinished(
    callback: Messages.CallbackTypes.OnUserTaskFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.notificationService.onUserTaskFinished(this.identity, callback, subscribeOnce);
  }

  public async onBoundaryEventTriggered(
    callback: Messages.CallbackTypes.OnBoundaryEventTriggeredCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.notificationService.onBoundaryEventTriggered(this.identity, callback, subscribeOnce);
  }

  public async onIntermediateThrowEventTriggered(
    callback: Messages.CallbackTypes.OnIntermediateThrowEventTriggeredCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.notificationService.onIntermediateThrowEventTriggered(this.identity, callback, subscribeOnce);
  }

  public async onIntermediateCatchEventReached(
    callback: Messages.CallbackTypes.OnIntermediateCatchEventReachedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.notificationService.onIntermediateCatchEventReached(this.identity, callback, subscribeOnce);
  }

  public async onIntermediateCatchEventFinished(
    callback: Messages.CallbackTypes.OnIntermediateCatchEventFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.notificationService.onIntermediateCatchEventFinished(this.identity, callback, subscribeOnce);
  }

  public async onNonInteractiveActivityReached(
    callback: Messages.CallbackTypes.OnActivityReachedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.notificationService.onActivityReached(this.identity, callback, subscribeOnce);
  }

  public async onNonInteractiveActivityFinished(
    callback: Messages.CallbackTypes.OnActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.notificationService.onActivityFinished(this.identity, callback, subscribeOnce);
  }

  public async onProcessStarted(
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.notificationService.onProcessStarted(this.identity, callback, subscribeOnce);
  }

  public async onProcessEnded(
    callback: Messages.CallbackTypes.OnProcessEndedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.notificationService.onProcessEnded(this.identity, callback, subscribeOnce);
  }

  public async onProcessTerminated(
    callback: Messages.CallbackTypes.OnProcessTerminatedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.notificationService.onProcessTerminated(this.identity, callback, subscribeOnce);
  }

  public async onProcessError(
    callback: Messages.CallbackTypes.OnProcessErrorCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.notificationService.onProcessError(this.identity, callback, subscribeOnce);
  }

  public async removeSubscription(subscription: Subscription): Promise<void> {
    return this.notificationService.removeSubscription(this.identity, subscription);
  }

}
