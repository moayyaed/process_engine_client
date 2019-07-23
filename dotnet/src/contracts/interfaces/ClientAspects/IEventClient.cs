namespace ProcessEngine.Client.Contracts.ClientAspects
{
    using System;
    using System.Threading.Tasks;

    using EssentialProjects.IAM.Contracts;
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
        /// <param name="identity">The requesting users identity.</param>
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
        Task<EventList> GetEventsForProcessModel(IIdentity identity, string processModelId);

        /// <summary>
        /// Retrieves a list of all triggerable events belonging to an instance
        /// of a specific ProcessModel.
        /// </summary>
        /// <param name="identity">The requesting users identity.</param>
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
        Task<EventList> GetEventsForCorrelation(IIdentity identity, string correlationId);

        /// <summary>
        /// Retrieves a list of all triggerable events belonging to an instance
        /// of a specific ProcessModel within a Correlation.
        /// </summary>
        /// <param name="identity">The requesting users identity.</param>
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
        Task<EventList> GetEventsForProcessModelInCorrelation(IIdentity identity, string processModelId, string correlationId);

        /// <summary>
        /// Triggers a message event.
        /// </summary>
        /// <param name="identity">The requesting users identity.</param>
        /// <param name="messageName">The name of the message to trigger.</param>
        /// <returns>
        /// A task that is finished once the event has been triggered.
        /// </returns>
        /// <exception cref="System.UnauthorizedAccessException">
        /// Thrown when the identity has insufficient rights to perform the
        /// operation.
        /// </exception>
        Task TriggerMessageEvent(IIdentity identity, string messageName);

        /// <summary>
        /// Triggers a message event.
        /// </summary>
        /// <param name="identity">The requesting users identity.</param>
        /// <param name="messageName">The name of the message to trigger.</param>
        /// <param name="payload">The payload with which to trigger the message.</param>
        /// <returns>
        /// A task that is finished once the event has been triggered.
        /// </returns>
        /// <exception cref="System.UnauthorizedAccessException">
        /// Thrown when the identity has insufficient rights to perform the
        /// operation.
        /// </exception>
        Task TriggerMessageEvent(IIdentity identity, string messageName, object payload);

        /// <summary>
        /// Triggers a signal event.
        /// </summary>
        /// <param name="identity">The requesting users identity.</param>
        /// <param name="signalName">The name of the signal to trigger.</param>
        /// <returns>
        /// A task that is finished once the event has been triggered.
        /// </returns>
        /// <exception cref="System.UnauthorizedAccessException">
        /// Thrown when the identity has insufficient rights to perform the
        /// operation.
        /// </exception>
        Task TriggerSignalEvent(IIdentity identity, string signalName);

        /// <summary>
        /// Triggers a signal event.
        /// </summary>
        /// <param name="identity">The requesting users identity.</param>
        /// <param name="signalName">The name of the signal to trigger.</param>
        /// <param name="payload">The payload with which to trigger the signal.</param>
        /// <returns>
        /// A task that is finished once the event has been triggered.
        /// </returns>
        /// <exception cref="System.UnauthorizedAccessException">
        /// Thrown when the identity has insufficient rights to perform the
        /// operation.
        /// </exception>
        Task TriggerSignalEvent(IIdentity identity, string signalName, object payload);
    }

}
