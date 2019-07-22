/* eslint-disable @typescript-eslint/no-unused-vars */
import * as emptyActivityClient from './iempty_activity_client';
import * as eventClient from './ievent_client';
import * as externalTaskClient from './iexternal_task_client';
import * as manualTaskClient from './imanual_task_client';
import * as notificationClient from './inotification_client';
import * as processModelClient from './iprocess_model_client';
import * as userTaskClient from './iuser_task_client';

export namespace ClientAspects {
  export import IEmptyActivityClient = emptyActivityClient.IEmptyActivityClient;
  export import IEventClient = eventClient.IEventClient;
  export import IExternalTaskClient = externalTaskClient.IExternalTaskClient;
  export import IManualTaskClient = manualTaskClient.IManualTaskClient;
  export import INotificationClient = notificationClient.INotificationClient;
  export import IProcessModelClient = processModelClient.IProcessModelClient;
  export import IUserTaskClient = userTaskClient.IUserTaskClient;
}
