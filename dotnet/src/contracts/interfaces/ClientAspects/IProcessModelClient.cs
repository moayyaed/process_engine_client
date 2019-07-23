namespace ProcessEngineClient.Contracts.ClientAspects
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using System;

    using EssentialProjects.IAM.Contracts;
    using ProcessEngine.ConsumerAPI.Contracts.DataModel;

    /// <summary>
    /// The IProcessModelClient is used to retreive ProcessModels and start ProcessInstances.
    /// </summary>
    internal interface IProcessModelClient
    {
        /// <summary>
        /// Starts an instance for a given ProcessDefinition. Process variables and correlation id may be supplied in the request payload.
        /// </summary>
        /// <returns>A set of informations about the started ProcessInstance; such as the used ProcessInstance ID or the assigned Correlation ID.</returns>
        /// <param name="identity">The requesting users <see cref="EssentialProjects.IAM.Contracts.IIdentity">identity</see>. Should usually contain an auth token.</param>
        /// <param name="processModelId">The ID of the ProcessDefinition to be retrieved.</param>
        /// <param name="startEventId">The ID of a specific StartEvent to start the process with.</param>
        /// <param name="processStartRequestPayload">The payload for the Start request. Contains variables for the ProcessInstance and optionally a CorrelationId.</param>
        /// <param name="callbackType"><see cref="StartCallbackType">Callback type</see></param>
        /// <param name="endEventId">The ID of the end event to wait for, when callbackType == StartCallbackType.CallbackOnEndEventReached.</param>
        Task<ProcessStartResponsePayload> StartProcessInstance<TInputValues>(
            IIdentity identity,
            string processModelId,
            string startEventId,
            ProcessStartRequestPayload<TInputValues> processStartRequestPayload,
            StartCallbackType callbackType = StartCallbackType.CallbackOnProcessInstanceCreated,
            string endEventId = "")
        where TInputValues : new();

        /// <summary>
        /// Gets the ProcessInstance results of a given correlation.
        /// </summary>
        /// <returns>The Correlation's results.</returns>
        /// <param name="identity">The requesting users <see cref="EssentialProjects.IAM.Contracts.IIdentity">identity</see>. Should usually contain an auth token.</param>
        /// <param name="correlationId">The ID of the Correlation for which to get the results.</param>
        /// <param name="processModelId">The ID of the ProcessDefinition for which to get the results.</param>
        /// <typeparam name="TPayload">The type that holds the definition for the Correlation result's payload.</typeparam>
        Task<IEnumerable<CorrelationResult<TPayload>>> GetProcessResultForCorrelation<TPayload>(
            IIdentity identity,
            string correlationId,
            string processModelId)
        where TPayload : new();
    }
}
