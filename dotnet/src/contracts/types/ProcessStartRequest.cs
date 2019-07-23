namespace ProcessEngine.Client.Contracts
{
    public class ProcessStartRequest<TPayload>
        where TPayload: new()
    {
        public ProcessStartRequest() {
            this.Payload = new TPayload();
        }

        public ProcessStartRequest(string correlationId, string parentProcessInstanceId, TPayload payload = default(TPayload))
        {
            this.CorrelationId = correlationId;
            this.ParentProcessInstanceId = parentProcessInstanceId;

            this.Payload = payload == null
                ? new TPayload()
                : payload;
        }

        public string CorrelationId { get; private set; }

        public string ParentProcessInstanceId { get; private set; }

        public TPayload Payload { get; private set; }
    }
}
