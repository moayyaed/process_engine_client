namespace ProcessEngineClient
{
    using global::ProcessEngine.ConsumerAPI.Client;
    using global::ProcessEngine.ConsumerAPI.Contracts;
    using global::ProcessEngine.ConsumerAPI.Contracts.DataModel;

    public class ProcessStartRequest<TPayload>
        where TPayload: new()
    {
        public ProcessStartRequest() {
            this.Payload = new TPayload();
        }

        public ProcessStartRequest(string correlationId, string parentProcessInstanceId, TPayload payload = new TPayload())
        {
            this.CorrelationId = correlationId;
            this.ParentProcessInstanceId = parentProcessInstanceId;
            this.Payload = payload;
        }

        public string CorrelationId { get; private set; }

        public string ParentProcessInstanceId { get; private set; }

        public TPayload Payload { get; private set; }
    }
}
