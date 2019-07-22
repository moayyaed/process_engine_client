export class ProcessStartRequest<TPayload> {

  public readonly correlationId: string
  public readonly parentProcessInstanceId: string
  public readonly payload: TPayload;

  constructor(correlationId: string, parentProcessInstanceId: string, payload: TPayload) {
    this.correlationId = correlationId;
    this.parentProcessInstanceId = parentProcessInstanceId;
    this.payload = payload;
  }

}
