namespace ProcessEngine.Client.Contracts.ClientAspects
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using ProcessEngine.ConsumerAPI.Contracts.DataModel;

    /// <summary>
    /// The IUserTaskClient is used to retreive and manage UserTasks.
    /// </summary>
    public interface IUserTaskClient
    {
        /// <summary>
        /// Retrieves a list of all suspended UserTasks belonging to an instance of a specific ProcessModel.
        /// </summary>
        /// <returns>The fetched UserTasks.</returns>
        /// <param name="processModelId">The ID of the ProcessDefinition for which to find UserTasks.</param>
        Task<IEnumerable<UserTask>> GetSuspendedUserTasksForProcessModel(string processModelId);

        /// <summary>
        /// Retrieves a list of all suspended UserTasks belonging to the given ProcessInstance.
        /// </summary>
        /// <returns>The fetched UserTasks.</returns>
        /// <param name="processInstanceId">The ID of the ProcessInstance for which to find UserTasks.</param>
        Task<IEnumerable<UserTask>> GetSuspendedUserTasksForProcessInstance(string processInstanceId);

        /// <summary>
        /// Retrieves a list of all suspended UserTasks belonging to a specific Correlation.
        /// </summary>
        /// <returns>The fetched UserTasks.</returns>
        /// <param name="correlationId">The ID of the Correlation for which to find UserTasks.</param>
        Task<IEnumerable<UserTask>> GetSuspendedUserTasksForCorrelation(string correlationId);

        /// <summary>
        /// Retrieves a list of all suspended UserTasks belonging to an instance of a specific ProcessModel within a Correlation.
        /// </summary>
        /// <returns>The fetched UserTasks.</returns>
        /// <param name="processModelId">The ID of the ProcessDefinition for which to find UserTasks.</param>
        /// <param name="correlationId">The ID of the Correlation for which to find UserTasks.</param>
        Task<IEnumerable<UserTask>> GetSuspendedUserTasksForProcessModelInCorrelation(string processModelId, string correlationId);

        /// <summary>
        /// Gets all waiting UserTasks belonging to the identity associated with the client.
        /// </summary>
        /// <returns>The fetched UserTasks.</returns>
        Task<IEnumerable<UserTask>> GetSuspendedUserTasksForClientIdentity();

        /// <summary>
        /// Finishes a UserTask belonging to an instance of a specific ProcessModel within a correlation.
        /// </summary>
        /// <param name="processInstanceId">The ID of the ProcessInstance that the UserTask belongs to.</param>
        /// <param name="correlationId">The ID of the Correlation that the UserTask belongs to.</param>
        /// <param name="userTaskInstanceId">The instance ID of the UserTask to finish.</param>
        /// <param name="userTaskResult">The result that the UserTask is to be finished with.</param>
        Task FinishUserTask(string processInstanceId, string correlationId, string userTaskInstanceId, UserTaskResult userTaskResult);
    }
}
