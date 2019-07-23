namespace ProcessEngineClient.Contracts
{
    public class ProcessStartResponse<TResponsePayload>
        where TResponsePayload: new()
    {
        public ProcessStartResponse(string processInstanceId, string correlationId, string endEventId, TResponsePayload payload = default(TResponsePayload))
        {
            this.ProcessInstanceId = processInstanceId;
            this.CorrelationId = correlationId;
            this.EndEventId = endEventId;

            this.Payload = payload == null
                ? new TResponsePayload()
                : payload;
        }

        public string ProcessInstanceId { get; private set; }

        public string CorrelationId { get; private set; }

        public string EndEventId { get; private set; }

        public TResponsePayload Payload { get; private set; }
    }
}
