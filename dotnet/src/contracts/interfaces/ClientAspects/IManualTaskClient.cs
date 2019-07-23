namespace ProcessEngine.Client.Contracts.ClientAspects
{
    using System.Threading.Tasks;
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
        /// <param name="processModelId">The ID of the ProcessDefinition for
        /// which to retrieve the ManualTasks.</param>
        Task<ManualTaskList> GetSuspendedManualTasksForProcessModel(string processModelId);

        /// <summary>
        /// Retrieves a list of all suspended ManualTasks belonging to an instance of a specific ProcessModel within a Correlation.
        /// </summary>
        /// <returns>The fetched ManualTasks.</returns>
        /// <param name="processInstanceId">The ID of the ProcessInstance for
        /// which to retrieve the ManualTasks.</param>
        Task<ManualTaskList> GetSuspendedManualTasksForProcessInstance(string processInstanceId);

        /// <summary>
        /// Retrieves a list of all suspended ManualTasks belonging to a specific Correlation.
        /// </summary>
        /// <returns>The fetched ManualTasks.</returns>
        /// <param name="correlationId">The ID of the Correlation for which to
        /// retrieve the ManualTasks.</param>
        Task<ManualTaskList> GetSuspendedManualTasksForCorrelation(string correlationId);

        /// <summary>
        /// Retrieves a list of all suspended ManualTasks belonging to an instance of a specific ProcessModel within a Correlation.
        /// </summary>
        /// <returns>The fetched ManualTasks.</returns>
        /// <param name="processModelId">The ID of the ProcessDefinition for
        /// which to retrieve the ManualTasks.</param>
        /// <param name="correlationId">The ID of the Correlation for which to retrieve the ManualTasks.</param>
        Task<ManualTaskList> GetSuspendedManualTasksForProcessModelInCorrelation(string processModelId, string correlationId);

        /// <summary>
        /// Gets all waiting ManualTasks belonging to the identity associated with the client.
        /// </summary>
        /// <returns>The fetched ManualTasks.</returns>
        Task<ManualTaskList> GetSuspendedManualTasksForClientIdentity();

        /// <summary>
        /// Finishes a ManualTask belonging to an instance of a specific ProcessModel within a correlation.
        /// </summary>
        /// <param name="processInstanceId">The ID of the ProcessInstance that the ManualTask belongs to.</param>
        /// <param name="correlationId">The ID of the Correlation that the ManualTask belongs to.</param>
        /// <param name="manualTaskInstanceId">The instance ID of the ManualTask to finish.</param>
        Task FinishManualTask(string processInstanceId, string correlationId, string manualTaskInstanceId);
    }
}
