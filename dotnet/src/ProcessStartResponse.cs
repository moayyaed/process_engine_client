namespace ProcessEngineClient
{
    using global::ProcessEngine.ConsumerAPI.Client;
    using global::ProcessEngine.ConsumerAPI.Contracts;
    using global::ProcessEngine.ConsumerAPI.Contracts.DataModel;

    /// <summary>
    /// The response for the processinstance start.
    /// </summary>
    /// <typeparam name="TResponsePayload">The type for the payload.</typeparam>
    public class ProcessStartResponse<TResponsePayload>
        where TResponsePayload: new()
    {
        /// <summary>
        /// 
        /// </summary>
        /// <value></value>
        public string ProcessInstanceId { get; set; }

        /// <summary>
        /// The correlation.
        /// </summary>
        /// <value></value>
        public string CorrelationId { get; set; }

        /// <summary>
        /// The endevent.
        /// </summary>
        /// <value></value>
        public string EndEventId { get; set; }

        /// <summary>
        /// The payload for the response.
        /// </summary>
        /// <value></value>
        public TResponsePayload Payload { get; set; }

        /// <summary>
        /// Create the Request.
        /// </summary>
        public ProcessStartResponse() 
        {
            this.Payload = new TResponsePayload();
        }
    }
}
