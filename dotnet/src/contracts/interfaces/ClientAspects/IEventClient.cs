namespace ProcessEngine.Client.Contracts.ClientAspects
{
    using System.Threading.Tasks;

    using ProcessEngine.ConsumerAPI.Contracts.DataModel;
    using ProcessEngine.ConsumerAPI.Contracts.Exceptions;

    /// <summary>
    /// The IEventClient is used to retrieve waiting events and to trigger
    /// them.
    /// </summary>
    public  interface IEventClient
    {
        /// <summary>
        /// Retrieves a list of all triggerable events belonging to an instance
        /// of a specific ProcessModel.
        /// </summary>
        /// <param name="processModelId">
        /// The ID of the ProcessModel for which to retrieve the events.
        /// </param>
        /// <returns>
        /// The fetched Events.
        /// </returns>
        /// <exception cref="System.UnauthorizedAccessException">
        /// Thrown when the identity has insufficient rights to perform the
        /// operation.
        /// </exception>
        /// <exception cref="ProcessNotFoundException">
        /// Thrown when the ProcessModel could not be found.
        /// </exception>
        Task<EventList> GetSuspendedEventsForProcessModel(string processModelId);

        /// <summary>
        /// Retrieves a list of all triggerable events belonging to an instance
        /// of a specific ProcessModel.
        /// </summary>
        /// <param name="correlationId">
        /// The ID of the Correlation for which to retrieve the events.
        /// </param>
        /// <returns>
        /// The fetched Events.
        /// </returns>
        /// <exception cref="System.UnauthorizedAccessException">
        /// Thrown when the identity has insufficient rights to perform the
        /// operation.
        /// </exception>
        /// <exception cref="ProcessNotFoundException">
        /// Thrown when the Correlation could not be found.
        /// </exception>
        Task<EventList> GetSuspendedEventsForCorrelation(string correlationId);

        /// <summary>
        /// Retrieves a list of all triggerable events belonging to an instance
        /// of a specific ProcessModel within a Correlation.
        /// </summary>
        /// <param name="processModelId">
        /// The ID of the ProcessModel for which to retrieve the events.
        /// </param>
        /// <param name="correlationId">
        /// The ID of the Correlation for which to retrieve the events.
        /// </param>
        /// <returns>
        /// The fetched Events.
        /// </returns>
        /// <exception cref="System.UnauthorizedAccessException">
        /// Thrown when the identity has insufficient rights to perform the
        /// operation.
        /// </exception>
        /// <exception cref="ProcessNotFoundException">
        /// Thrown when the ProcessModel or the Correlation could not be found.
        /// </exception>
        Task<EventList> GetSuspendedEventsForProcessModelInCorrelation(string processModelId, string correlationId);

        /// <summary>
        /// Triggers a message event.
        /// </summary>
        /// <param name="messageName">The name of the message to trigger.</param>
        /// <returns>
        /// A task that is finished once the event has been triggered.
        /// </returns>
        /// <exception cref="System.UnauthorizedAccessException">
        /// Thrown when the identity has insufficient rights to perform the
        /// operation.
        /// </exception>
        Task TriggerMessageEvent(string messageName);

        /// <summary>
        /// Triggers a message event.
        /// </summary>
        /// <param name="messageName">The name of the message to trigger.</param>
        /// <param name="payload">The payload with which to trigger the message.</param>
        /// <returns>
        /// A task that is finished once the event has been triggered.
        /// </returns>
        /// <exception cref="System.UnauthorizedAccessException">
        /// Thrown when the identity has insufficient rights to perform the
        /// operation.
        /// </exception>
        Task TriggerMessageEvent<TPayload>(string messageName, TPayload payload);

        /// <summary>
        /// Triggers a signal event.
        /// </summary>
        /// <param name="signalName">The name of the signal to trigger.</param>
        /// <returns>
        /// A task that is finished once the event has been triggered.
        /// </returns>
        /// <exception cref="System.UnauthorizedAccessException">
        /// Thrown when the identity has insufficient rights to perform the
        /// operation.
        /// </exception>
        Task TriggerSignalEvent(string signalName);

        /// <summary>
        /// Triggers a signal event.
        /// </summary>
        /// <param name="signalName">The name of the signal to trigger.</param>
        /// <param name="payload">The payload with which to trigger the signal.</param>
        /// <returns>
        /// A task that is finished once the event has been triggered.
        /// </returns>
        /// <exception cref="System.UnauthorizedAccessException">
        /// Thrown when the identity has insufficient rights to perform the
        /// operation.
        /// </exception>
        Task TriggerSignalEvent<TPayload>(string signalName, TPayload payload);
    }

}
