namespace ProcessEngine.Client.Contracts.ClientAspects
{
    using System.Collections.Generic;
    using System.Threading.Tasks;

    using ProcessEngine.ConsumerAPI.Contracts.DataModel;
    using ProcessEngine.ConsumerAPI.Contracts.Exceptions;

    /// <summary>
    /// The IEventColient is used to retrieve waiting events and to trigger
    /// them.
    /// </summary>
    public interface IEmptyActivityClient
    {
        /// <summary>
        /// Retrieves a list of all suspended EmptyActivities belonging to an instance of a specific ProcessModel.
        /// </summary>
        /// <returns>The fetched EmptyActivities.</returns>
        /// <param name="processModelId">The ID of the ProcessDefinition for
        /// which to retrieve the EmptyActivities.</param>
        /// <exception cref="System.UnauthorizedAccessException">Thrown when the identity has insufficient rights to perform the operation.</exception>
        /// <exception cref="ProcessNotFoundException"> Thrown when the ProcessModel could not be found.</exception>
        Task<IEnumerable<EmptyActivity>> GetSuspendedEmptyActivitiesForProcessModel(string processModelId);

        /// <summary>
        /// Retrieves a list of all suspended EmptyActivities belonging to an instance of a specific ProcessModel within a Correlation.
        /// </summary>
        /// <returns>The fetched EmptyActivities.</returns>
        /// <param name="processInstanceId">The ID of the ProcessInstance for which to retrieve the EmptyActivities.</param>
        /// <exception cref="System.UnauthorizedAccessException">Thrown when the identity has insufficient rights to perform the operation.</exception>
        /// <exception cref="ProcessNotFoundException"> Thrown when the ProcessInstance could not be found.</exception>
        Task<IEnumerable<EmptyActivity>> GetSuspendedEmptyActivitiesForProcessInstance(string processInstanceId);

        /// <summary>
        /// Retrieves a list of all suspended EmptyActivities belonging to a specific Correlation.
        /// </summary>
        /// <returns>The fetched EmptyActivities.</returns>
        /// <param name="correlationId">The ID of the Correlation for which to retrieve the EmptyActivities.</param>
        /// <exception cref="System.UnauthorizedAccessException">Thrown when the identity has insufficient rights to perform the operation.</exception>
        /// <exception cref="ProcessNotFoundException"> Thrown when the Correlation could not be found.</exception>
        Task<IEnumerable<EmptyActivity>> GetSuspendedEmptyActivitiesForCorrelation(string correlationId);

        /// <summary>
        /// Retrieves a list of all suspended EmptyActivities belonging to an instance of a specific ProcessModel within a Correlation.
        /// </summary>
        /// <returns>The fetched EmptyActivities.</returns>
        /// <param name="processModelId">The ID of the ProcessDefinition for which to retrieve the EmptyActivities.</param>
        /// <param name="correlationId">The ID of the Correlation for which to retrieve the EmptyActivities.</param>
        /// <exception cref="System.UnauthorizedAccessException">Thrown when the identity has insufficient rights to perform the operation.</exception>
        /// <exception cref="ProcessNotFoundException"> Thrown when the ProcessModel or Correlation could not be found.</exception>
        Task<IEnumerable<EmptyActivity>> GetSuspendedEmptyActivitiesForProcessModelInCorrelation(string processModelId, string correlationId);

        /// <summary>
        /// Gets all waiting EmptyActivities belonging to the identity associated with the client.
        /// </summary>
        /// <returns>The fetched EmptyActivities.</returns>
        Task<IEnumerable<EmptyActivity>> GetSuspendedEmptyActivitiesForClientIdentity();

        /// <summary>
        /// Finishes a EmptyActivity belonging to an instance of a specific ProcessModel within a correlation.
        /// </summary>
        /// <param name="processInstanceId">The ID of the ProcessInstance that the EmptyActivity belongs to.</param>
        /// <param name="correlationId">The ID of the Correlation that the EmptyActivity belongs to.</param>
        /// <param name="emptyActivityInstanceId">The instance ID of the EmptyActivity to finish.</param>
        /// <exception cref="System.UnauthorizedAccessException">Thrown when the identity has insufficient rights to perform the operation.</exception>
        /// <exception cref="ProcessNotFoundException"> Thrown when the ProcessInstance, Correlation or EmptyActivityInstance could not be found.</exception>
        Task FinishEmptyActivity(string processInstanceId, string correlationId, string emptyActivityInstanceId);
    }

}
