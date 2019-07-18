export class ProcessStartResponse<TResponsePayload> {

  public processInstanceId: string;
  public correlationId: string;
  public endEventId: string;
  public payload: TResponsePayload;

}
