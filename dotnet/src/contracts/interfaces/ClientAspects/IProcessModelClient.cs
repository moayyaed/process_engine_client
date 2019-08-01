namespace ProcessEngine.Client.Contracts.ClientAspects
{
    using System.Collections.Generic;
    using System.Threading.Tasks;

    using ProcessEngine.ConsumerAPI.Contracts.DataModel;

    /// <summary>
    /// The IProcessModelClient is used to retreive ProcessModels and start ProcessInstances.
    /// </summary>
    public interface IProcessModelClient
    {
        /// <summary>
        /// Gets all ProcessModels that the Identity associated with the client can access.
        /// </summary>
        /// <returns>The retrieved ProcessModels.</returns>
        Task<IEnumerable<ProcessModel>> GetProcessModels();

        /// <summary>
        /// Gets the ProcessModel with the given ID.
        /// </summary>
        /// <param name="processModelId">The ID of the ProcessModel to get</param>
        /// <returns>The retrieved ProcessModel</returns>
        Task<ProcessModel> GetProcessModelById(string processModelId);

        /// <summary>
        /// Gets the ProcesssModel belonging to the given ProcessInstance.
        /// </summary>
        /// <param name="processInstanceId">The ID of the ProcessInstance for which to get the ProcessModel</param>
        /// <returns>The retrieved ProcessModel</returns>
        Task<ProcessModel> GetProcessModelByProcessInstanceId(string processInstanceId);

        /// <summary>
        /// Gets a list of all ProcessInstances started by the Identity associated with the client.
        /// </summary>
        /// <returns>The List of ProcessInstances</returns>
        Task<IEnumerable<ProcessInstance>> GetProcessInstancesForClientIdentity();

        /// <summary>
        /// Starts an instance for a given ProcessDefinition. Process variables and correlation id may be supplied in the request payload.
        /// </summary>
        /// <returns>A set of informations about the started ProcessInstance; such as the used ProcessInstance ID or the assigned Correlation ID.</returns>
        /// <param name="processModelId">The ID of the ProcessDefinition to be retrieved.</param>
        /// <param name="startEventId">The ID of a specific StartEvent to start the process with.</param>
        /// <param name="requestParams">The payload for the Start request. Contains variables for the ProcessInstance and optionally a CorrelationId.</param>
        /// <param name="callbackType"><see cref="StartCallbackType">Callback type</see></param>
        /// <param name="endEventId">The ID of the end event to wait for, when callbackType == StartCallbackType.CallbackOnEndEventReached.</param>
        Task<ProcessStartResponse<TResponsePayload>> StartProcessInstance<TRequestPayload, TResponsePayload>(
            string processModelId,
            string startEventId,
            ProcessStartRequest<TRequestPayload> requestParams,
            StartCallbackType callbackType = StartCallbackType.CallbackOnProcessInstanceCreated,
            string endEventId = ""
        )
        where TRequestPayload : new()
        where TResponsePayload : new();

        /// <summary>
        /// Gets the results of a given correlation.
        /// </summary>
        /// <returns>The Correlation's results.</returns>
        /// <param name="correlationId">The ID of the Correlation for which to get the results.</param>
        /// <param name="processModelId">The ID of the ProcessDefinition for which to get the results.</param>
        /// <typeparam name="TPayload">The type that holds the definition for the Correlation result's payload.</typeparam>
        Task<IEnumerable<CorrelationResult<TPayload>>> GetResultForProcessModelInCorrelation<TPayload>(
            string correlationId,
            string processModelId
        )
        where TPayload : new();
    }
}
