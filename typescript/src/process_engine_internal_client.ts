import {Subscription} from '@essential-projects/event_aggregator_contracts';
import {IIdentity} from '@essential-projects/iam_contracts';

import {
  DataModels,
  IConsumerApi,
  Messages,
} from '@process-engine/consumer_api_contracts';
import {IExternalTaskApi} from '@process-engine/external_task_api_contracts';

import {Interfaces, Types} from './contracts/index';
import {ExternalTaskWorker} from './external_task_worker/index';

export class ProcessEngineInternalClient implements Interfaces.IProcessEngineClient {

  private readonly consumerApiService: IConsumerApi;
  private readonly externalTaskApiService: IExternalTaskApi;
  private readonly identity: IIdentity;

  private readonly dummyIdentity: IIdentity = {
    token: 'ZHVtbXlfdG9rZW4=',
    userId: 'dummy_token',
  }

  constructor(consumerApiService: IConsumerApi, externalTaskApiService: IExternalTaskApi, identity?: IIdentity) {
    this.consumerApiService = consumerApiService;
    this.externalTaskApiService = externalTaskApiService;
    this.identity = identity || this.dummyIdentity;
  }

  // Process models and instances
  public async getProcessModels(): Promise<Array<DataModels.ProcessModels.ProcessModel>> {
    const result = await this.consumerApiService.getProcessModels(this.identity);
    return result.processModels;
  }

  public async getProcessModelById(processModelId: string): Promise<DataModels.ProcessModels.ProcessModel> {
    return this.consumerApiService.getProcessModelById(this.identity, processModelId);
  }

  public async getProcessModelByProcessInstanceId(processInstanceId: string): Promise<DataModels.ProcessModels.ProcessModel> {
    return this.consumerApiService.getProcessModelByProcessInstanceId(this.identity, processInstanceId);
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
      .consumerApiService
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
  ): Promise<Array<DataModels.CorrelationResult>> {
    return this.consumerApiService.getProcessResultForCorrelation(this.identity, correlationId, processModelId);
  }

  public async getProcessInstancesForClientIdentity(): Promise<Array<DataModels.ProcessInstance>> {
    return this.consumerApiService.getProcessInstancesByIdentity(this.identity);
  }

  // Events
  public async getSuspendedEventsForProcessModel(processModelId: string): Promise<Array<DataModels.Events.Event>> {
    const result = await this.consumerApiService.getEventsForProcessModel(this.identity, processModelId);
    return result.events;
  }

  public async getSuspendedEventsForCorrelation(correlationId: string): Promise<Array<DataModels.Events.Event>> {
    const result = await this.consumerApiService.getEventsForCorrelation(this.identity, correlationId);
    return result.events;
  }

  public async getSuspendedEventsForProcessModelInCorrelation(
    processModelId: string,
    correlationId: string,
  ): Promise<Array<DataModels.Events.Event>> {
    const result = await this.consumerApiService.getEventsForProcessModelInCorrelation(this.identity, processModelId, correlationId);
    return result.events;
  }

  public async triggerMessageEvent(messageName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {
    return this.consumerApiService.triggerMessageEvent(this.identity, messageName, payload);
  }

  public async triggerSignalEvent(signalName: string, payload?: DataModels.Events.EventTriggerPayload): Promise<void> {
    return this.consumerApiService.triggerSignalEvent(this.identity, signalName, payload);
  }

  // Empty Activities
  public async getSuspendedEmptyActivitiesForProcessModel(processModelId: string): Promise<Array<DataModels.EmptyActivities.EmptyActivity>> {
    const result = await this.consumerApiService.getEmptyActivitiesForProcessModel(this.identity, processModelId);
    return result.emptyActivities;
  }

  public async getSuspendedEmptyActivitiesForProcessInstance(processInstanceId: string): Promise<Array<DataModels.EmptyActivities.EmptyActivity>> {
    const result = await this.consumerApiService.getEmptyActivitiesForProcessInstance(this.identity, processInstanceId);
    return result.emptyActivities;
  }

  public async getSuspendedEmptyActivitiesForCorrelation(correlationId: string): Promise<Array<DataModels.EmptyActivities.EmptyActivity>> {
    const result = await this.consumerApiService.getEmptyActivitiesForCorrelation(this.identity, correlationId);
    return result.emptyActivities;
  }

  public async getSuspendedEmptyActivitiesForProcessModelInCorrelation(
    processModelId: string,
    correlationId: string,
  ): Promise<Array<DataModels.EmptyActivities.EmptyActivity>> {
    const result = await this.consumerApiService.getEmptyActivitiesForProcessModelInCorrelation(this.identity, processModelId, correlationId);
    return result.emptyActivities;
  }

  public async getSuspendedEmptyActivitiesForClientIdentity(): Promise<Array<DataModels.EmptyActivities.EmptyActivity>> {
    const result = await this.consumerApiService.getWaitingEmptyActivitiesByIdentity(this.identity);
    return result.emptyActivities;
  }

  public async finishEmptyActivity(
    processInstanceId: string,
    correlationId: string,
    emptyActivityInstanceId: string,
  ): Promise<void> {
    return this.consumerApiService.finishEmptyActivity(this.identity, processInstanceId, correlationId, emptyActivityInstanceId);
  }

  // UserTasks
  public async getSuspendedUserTasksForProcessModel(processModelId: string): Promise<Array<DataModels.UserTasks.UserTask>> {
    const result = await this.consumerApiService.getUserTasksForProcessModel(this.identity, processModelId);
    return result.userTasks;
  }

  public async getSuspendedUserTasksForProcessInstance(processInstanceId: string): Promise<Array<DataModels.UserTasks.UserTask>> {
    const result = await this.consumerApiService.getUserTasksForProcessInstance(this.identity, processInstanceId);
    return result.userTasks;
  }

  public async getSuspendedUserTasksForCorrelation(correlationId: string): Promise<Array<DataModels.UserTasks.UserTask>> {
    const result = await this.consumerApiService.getUserTasksForCorrelation(this.identity, correlationId);
    return result.userTasks;
  }

  public async getSuspendedUserTasksForProcessModelInCorrelation(
    processModelId: string,
    correlationId: string,
  ): Promise<Array<DataModels.UserTasks.UserTask>> {
    const result = await this.consumerApiService.getUserTasksForProcessModelInCorrelation(this.identity, processModelId, correlationId);
    return result.userTasks;
  }

  public async getSuspendedUserTasksForClientIdentity(): Promise<Array<DataModels.UserTasks.UserTask>> {
    const result = await this.consumerApiService.getWaitingUserTasksByIdentity(this.identity);
    return result.userTasks;
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
  public async getSuspendedManualTasksForProcessModel(processModelId: string): Promise<Array<DataModels.ManualTasks.ManualTask>> {
    const result = await this.consumerApiService.getManualTasksForProcessModel(this.identity, processModelId);
    return result.manualTasks;
  }

  public async getSuspendedManualTasksForProcessInstance(processInstanceId: string): Promise<Array<DataModels.ManualTasks.ManualTask>> {
    const result = await this.consumerApiService.getManualTasksForProcessInstance(this.identity, processInstanceId);
    return result.manualTasks;
  }

  public async getSuspendedManualTasksForCorrelation(correlationId: string): Promise<Array<DataModels.ManualTasks.ManualTask>> {
    const result = await this.consumerApiService.getManualTasksForCorrelation(this.identity, correlationId);
    return result.manualTasks;
  }

  public async getSuspendedManualTasksForProcessModelInCorrelation(
    processModelId: string,
    correlationId: string,
  ): Promise<Array<DataModels.ManualTasks.ManualTask>> {
    const result = await this.consumerApiService.getManualTasksForProcessModelInCorrelation(this.identity, processModelId, correlationId);
    return result.manualTasks;
  }

  public async getSuspendedManualTasksForClientIdentity(): Promise<Array<DataModels.ManualTasks.ManualTask>> {
    const result = await this.consumerApiService.getWaitingManualTasksByIdentity(this.identity);
    return result.manualTasks;
  }

  public async finishManualTask(
    processInstanceId: string,
    correlationId: string,
    manualTaskInstanceId: string,
  ): Promise<void> {
    return this.consumerApiService.finishManualTask(this.identity, processInstanceId, correlationId, manualTaskInstanceId);
  }

  // ExternalTasks
  public subscribeToExternalTasksWithTopic<TPayload, TResult>(
    topic: string,
    handleAction: Types.HandleExternalTaskAction<TPayload, TResult>,
    maxTasks: number = 10,
    timeout: number = 1000,
  ): Interfaces.IExternalTaskWorker {
    const externalTaskWorker = new ExternalTaskWorker(this.externalTaskApiService);

    externalTaskWorker.subscribeToExternalTasksWithTopic<TPayload, TResult>(this.identity, topic, maxTasks, timeout, handleAction);

    return externalTaskWorker;
  }

  // Notifications
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

  public async onNonInteractiveActivityReached(
    callback: Messages.CallbackTypes.OnActivityReachedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onActivityReached(this.identity, callback, subscribeOnce);
  }

  public async onNonInteractiveActivityFinished(
    callback: Messages.CallbackTypes.OnActivityFinishedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onActivityFinished(this.identity, callback, subscribeOnce);
  }

  public async onProcessStarted(
    callback: Messages.CallbackTypes.OnProcessStartedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onProcessStarted(this.identity, callback, subscribeOnce);
  }

  public async onProcessEnded(
    callback: Messages.CallbackTypes.OnProcessEndedCallback,
    subscribeOnce: boolean = false,
  ): Promise<Subscription> {
    return this.consumerApiService.onProcessEnded(this.identity, callback, subscribeOnce);
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

  public async removeSubscription(subscription: Subscription): Promise<void> {
    return this.consumerApiService.removeSubscription(this.identity, subscription);
  }

}
