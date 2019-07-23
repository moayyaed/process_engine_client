namespace ProcessEngine.Client.Contracts.ClientAspects
{
    using System.Threading.Tasks;

    using EssentialProjects.IAM.Contracts;
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
        /// <param name="identity">The requesting users <see cref="EssentialProjects.IAM.Contracts.IIdentity">identity</see>. Should usually contain an auth token.</param>
        /// <param name="processModelId">The ID of the ProcessDefinition for
        /// which to retrieve the EmptyActivities.</param>
        /// <exception cref="System.UnauthorizedAccessException">Thrown when the identity has insufficient rights to perform the operation.</exception>
        /// <exception cref="ProcessNotFoundException"> Thrown when the ProcessModel could not be found.</exception>
        Task<EmptyActivityList> GetEmptyActivitiesForProcessModel(IIdentity identity, string processModelId);

        /// <summary>
        /// Retrieves a list of all suspended EmptyActivities belonging to an instance of a specific ProcessModel within a Correlation.
        /// </summary>
        /// <returns>The fetched EmptyActivities.</returns>
        /// <param name="identity">The requesting users <see cref="EssentialProjects.IAM.Contracts.IIdentity">identity</see>. Should usually contain an auth token.</param>
        /// <param name="processInstanceId">The ID of the ProcessInstance for which to retrieve the EmptyActivities.</param>
        /// <exception cref="System.UnauthorizedAccessException">Thrown when the identity has insufficient rights to perform the operation.</exception>
        /// <exception cref="ProcessNotFoundException"> Thrown when the ProcessInstance could not be found.</exception>
        Task<EmptyActivityList> GetEmptyActivitiesForProcessInstance(IIdentity identity, string processInstanceId);

        /// <summary>
        /// Retrieves a list of all suspended EmptyActivities belonging to a specific Correlation.
        /// </summary>
        /// <returns>The fetched EmptyActivities.</returns>
        /// <param name="identity">The requesting users <see cref="EssentialProjects.IAM.Contracts.IIdentity">identity</see>. Should usually contain an auth token.</param>
        /// <param name="correlationId">The ID of the Correlation for which to retrieve the EmptyActivities.</param>
        /// <exception cref="System.UnauthorizedAccessException">Thrown when the identity has insufficient rights to perform the operation.</exception>
        /// <exception cref="ProcessNotFoundException"> Thrown when the Correlation could not be found.</exception>
        Task<EmptyActivityList> GetEmptyActivitiesForCorrelation(IIdentity identity, string correlationId);

        /// <summary>
        /// Retrieves a list of all suspended EmptyActivities belonging to an instance of a specific ProcessModel within a Correlation.
        /// </summary>
        /// <returns>The fetched EmptyActivities.</returns>
        /// <param name="identity">The requesting users <see cref="EssentialProjects.IAM.Contracts.IIdentity">identity</see>. Should usually contain an auth token.</param>
        /// <param name="processModelId">The ID of the ProcessDefinition for which to retrieve the EmptyActivities.</param>
        /// <param name="correlationId">The ID of the Correlation for which to retrieve the EmptyActivities.</param>
        /// <exception cref="System.UnauthorizedAccessException">Thrown when the identity has insufficient rights to perform the operation.</exception>
        /// <exception cref="ProcessNotFoundException"> Thrown when the ProcessModel or Correlation could not be found.</exception>
        Task<EmptyActivityList> GetEmptyActivitiesForProcessModelInCorrelation(IIdentity identity, string processModelId, string correlationId);

        /// <summary>
        /// Gets all waiting EmptyActivities belonging to the given identity.
        /// </summary>
        /// <returns>The fetched EmptyActivities.</returns>
        /// <param name="identity">The requesting users <see cref="EssentialProjects.IAM.Contracts.IIdentity">identity</see>. Should usually contain an auth token.</param>
        Task<EmptyActivityList> GetWaitingEmptyActivitiesByIdentity(IIdentity identity);

        /// <summary>
        /// Finishes a EmptyActivity belonging to an instance of a specific ProcessModel within a correlation.
        /// </summary>
        /// <param name="identity">The requesting users <see cref="EssentialProjects.IAM.Contracts.IIdentity">identity</see>. Should usually contain an auth token.</param>
        /// <param name="processInstanceId">The ID of the ProcessInstance that the EmptyActivity belongs to.</param>
        /// <param name="correlationId">The ID of the Correlation that the EmptyActivity belongs to.</param>
        /// <param name="emptyActivityInstanceId">The instance ID of the EmptyActivity to finish.</param>
        /// <exception cref="System.UnauthorizedAccessException">Thrown when the identity has insufficient rights to perform the operation.</exception>
        /// <exception cref="ProcessNotFoundException"> Thrown when the ProcessInstance, Correlation or EmptyActivityInstance could not be found.</exception>
        Task FinishEmptyActivity(IIdentity identity, string processInstanceId, string correlationId, string emptyActivityInstanceId);
    }

}
