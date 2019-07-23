namespace ProcessEngine.Client.Contracts.ClientAspects
{
    using System.Threading.Tasks;
    using EssentialProjects.IAM.Contracts;
    using ProcessEngine.ConsumerAPI.Contracts.DataModel;

    /// <summary>
    /// The IManualTaskClient is used to retreive and manage ManualTasks.
    /// </summary>
    public interface IManualTaskClient
    {
        /// <summary>
        /// Retrieves a list of all suspended ManualTasks belonging to an instance of a specific ProcessModel.
        /// </summary>
        /// <returns>The fetched ManualTasks.</returns>
        /// <param name="identity">The requesting users <see cref="EssentialProjects.IAM.Contracts.IIdentity">identity</see>. Should usually contain an auth token.</param>
        /// <param name="processModelId">The ID of the ProcessDefinition for
        /// which to retrieve the ManualTasks.</param>
        Task<ManualTaskList> GetManualTasksForProcessModel(IIdentity identity, string processModelId);

        /// <summary>
        /// Retrieves a list of all suspended ManualTasks belonging to an instance of a specific ProcessModel within a Correlation.
        /// </summary>
        /// <returns>The fetched ManualTasks.</returns>
        /// <param name="identity">The requesting users <see cref="EssentialProjects.IAM.Contracts.IIdentity">identity</see>. Should usually contain an auth token.</param>
        /// <param name="processInstanceId">The ID of the ProcessInstance for
        /// which to retrieve the ManualTasks.</param>
        Task<ManualTaskList> GetManualTasksForProcessInstance(IIdentity identity, string processInstanceId);

        /// <summary>
        /// Retrieves a list of all suspended ManualTasks belonging to a specific Correlation.
        /// </summary>
        /// <returns>The fetched ManualTasks.</returns>
        /// <param name="identity">The requesting users <see cref="EssentialProjects.IAM.Contracts.IIdentity">identity</see>. Should usually contain an auth token.</param>
        /// <param name="correlationId">The ID of the Correlation for which to
        /// retrieve the ManualTasks.</param>
        Task<ManualTaskList> GetManualTasksForCorrelation(IIdentity identity, string correlationId);

        /// <summary>
        /// Retrieves a list of all suspended ManualTasks belonging to an instance of a specific ProcessModel within a Correlation.
        /// </summary>
        /// <returns>The fetched ManualTasks.</returns>
        /// <param name="identity">The requesting users <see cref="EssentialProjects.IAM.Contracts.IIdentity">identity</see>. Should usually contain an auth token.</param>
        /// <param name="processModelId">The ID of the ProcessDefinition for
        /// which to retrieve the ManualTasks.</param>
        /// <param name="correlationId">The ID of the Correlation for which to retrieve the ManualTasks.</param>
        Task<ManualTaskList> GetManualTasksForProcessModelInCorrelation(IIdentity identity, string processModelId, string correlationId);

        /// <summary>
        /// Gets all waiting ManualTasks belonging to the given identity.
        /// </summary>
        /// <returns>The fetched ManualTasks.</returns>
        /// <param name="identity">The requesting users <see cref="EssentialProjects.IAM.Contracts.IIdentity">identity</see>. Should usually contain an auth token.</param>
        Task<ManualTaskList> GetWaitingManualTasksByIdentity(IIdentity identity);

        /// <summary>
        /// Finishes a ManualTask belonging to an instance of a specific ProcessModel within a correlation.
        /// </summary>
        /// <param name="identity">The requesting users <see cref="EssentialProjects.IAM.Contracts.IIdentity">identity</see>. Should usually contain an auth token.</param>
        /// <param name="processInstanceId">The ID of the ProcessInstance that the ManualTask belongs to.</param>
        /// <param name="correlationId">The ID of the Correlation that the ManualTask belongs to.</param>
        /// <param name="manualTaskInstanceId">The instance ID of the ManualTask to finish.</param>
        Task FinishManualTask(IIdentity identity, string processInstanceId, string correlationId, string manualTaskInstanceId);
    }
}
