export class ProcessStartRequest<TPayload> {

  public correlationId: string
  public parentProcessInstanceId: string
  public payload: TPayload;

}
