namespace ProcessEngineClient
{
    using global::ProcessEngine.ConsumerAPI.Client;
    using global::ProcessEngine.ConsumerAPI.Contracts;
    using global::ProcessEngine.ConsumerAPI.Contracts.DataModel;

    public class ProcessStartResponse<TResponsePayload>
        where TResponsePayload: new()
    {
        public ProcessStartResponse(string processInstanceId, string correlationId, string endEventId, TResponsePayload payload = new TResponsePayload())
        {
            this.ProcessInstanceId = processInstanceId;
            this.CorrelationId = correlationId;
            this.EndEventId = endEventId;
            this.Payload = payload;
        }

        public string ProcessInstanceId { get; private set; }

        public string CorrelationId { get; private set; }

        public string EndEventId { get; private set; }

        public TResponsePayload Payload { get; private set; }
    }
}
