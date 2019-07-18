export class ProcessStartResponse<TPayload> {

  public readonly processInstanceId: string;
  public readonly correlationId: string;
  public readonly endEventId: string;
  public readonly payload: TPayload;

  constructor(correlationId: string, processInstanceId: string, endEventId: string, payload: TPayload) {
    this.correlationId = correlationId;
    this.processInstanceId = processInstanceId;
    this.endEventId = endEventId;
    this.payload = payload;
  }

}
