import {Subscription} from '@essential-projects/event_aggregator_contracts';
import {Messages} from '@process-engine/consumer_api_contracts';

export interface INotificationClient {

  // Socket.IO Notifications
  onEmptyActivityWaiting(callback: Messages.CallbackTypes.OnEmptyActivityWaitingCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onEmptyActivityFinished(callback: Messages.CallbackTypes.OnEmptyActivityFinishedCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onManualTaskWaiting(callback: Messages.CallbackTypes.OnManualTaskWaitingCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onManualTaskFinished(callback: Messages.CallbackTypes.OnManualTaskFinishedCallback, subscribeOnce?: boolean): Promise<Subscription>;

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

  onNonInteractiveActivityReached(callback: Messages.CallbackTypes.OnActivityReachedCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onNonInteractiveActivityFinished(callback: Messages.CallbackTypes.OnActivityFinishedCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onProcessStarted(callback: Messages.CallbackTypes.OnProcessStartedCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onProcessEnded(callback: Messages.CallbackTypes.OnProcessEndedCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onProcessTerminated(callback: Messages.CallbackTypes.OnProcessTerminatedCallback, subscribeOnce?: boolean): Promise<Subscription>;

  onProcessError(callback: Messages.CallbackTypes.OnProcessErrorCallback, subscribeOnce?: boolean): Promise<Subscription>;

  removeSubscription(subscription: Subscription): Promise<void>;

}
