namespace ProcessEngineClient
{
    using global::ProcessEngine.ConsumerAPI.Client;
    using global::ProcessEngine.ConsumerAPI.Contracts;
    using global::ProcessEngine.ConsumerAPI.Contracts.DataModel;

    /// <summary>
    /// The request to start a process-instance.
    /// </summary>
    /// <typeparam name="TPayload">The type to use for the create request.</typeparam>
    public class ProcessStartRequest<TPayload>
        where TPayload: new()
    {
        /// <summary>
        /// The correlation id.
        /// </summary>
        public string CorrelationId { get; set; }

        /// <summary>
        /// The id of the parent processinstance
        /// </summary>
        public string ParentProcessInstanceId { get; set; }

        /// <summary>
        /// The payload to use to create a new process-instance.
        /// </summary>
        public TPayload Payload { get; set;}

        /// <summary>
        /// Create a new request to start a process-instance.
        /// </summary>
        public ProcessStartRequest()
        {
            this.Payload = new TPayload();
        }
    }    
}
