/* eslint-disable @typescript-eslint/no-unused-vars */
import * as interfaces from './interfaces/index';
import * as types from './types/index';

export namespace Interfaces {
  export import ClientAspects = interfaces.ClientAspects;
  export import IDisposable = interfaces.IDisposable;
  export import IExternalTaskWorker = interfaces.IExternalTaskWorker;
  export import IProcessEngineClient = interfaces.IProcessEngineClient;
}

export namespace Types {
  export import HandleExternalTaskAction = types.HandleExternalTaskAction;
  export import HttpClientConfig = types.HttpClientConfig;
  export import ProcessStartRequest = types.ProcessStartRequest;
  export import ProcessStartResponse = types.ProcessStartResponse;
}
