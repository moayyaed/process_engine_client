namespace ProcessEngine.Client.Contracts
{
    using System.Threading.Tasks;

    using ProcessEngine.ConsumerAPI.Contracts;
    using ProcessEngine.ConsumerAPI.Contracts.DataModel;

    using EssentialProjects.IAM.Contracts;

    /// <summary>
    /// Definition of the HandleExternalTask Callback.
    /// </summary>
    public delegate Task<ExternalTaskResultBase> ExtendedHandleExternalTaskAction<TPayload, TResult>(TPayload payload, ExternalTask<TPayload> externalTask);

    /// <summary>
    /// Periodically fetches, locks and processes ExternalTasks for a given topic.
    /// </summary>
    internal interface IExternalTaskWorker
    {
        /// <summary>
        /// The Id of the worker.
        /// </summary>
        string WorkerId { get; }

        /// <summary>
        /// Indicates if the worker is currently polling for and handling ExternalTasks.
        /// </summary>
        /// <value></value>
        bool IsActive { get; }

        /// <summary>
        /// Periodically fetches, locks and processes available ExternalTasks with a given topic,
        /// using the given callback as a processing function.
        /// </summary>
        /// <param name="identity">
        /// The identity to use for fetching and processing ExternalTasks.
        /// </param>
        /// <param name="topic">
        /// The topic by which to look for and process ExternalTasks.
        /// </param>
        /// <param name="maxTasks">
        /// max. ExternalTasks to fetch.
        /// </param>
        /// <param name="longpollingTimeout">
        /// Longpolling Timeout in ms.
        /// </param>
        /// <param name="handleAction">
        /// The function for processing the ExternalTasks.
        /// </param>
        Task SubscribeToExternalTasksWithTopic<TPayload, TResult>(
            IIdentity identity,
            string topic,
            int maxTasks,
            int longpollingTimeout,
            ExtendedHandleExternalTaskAction<TPayload, TResult> handleAction
        )
        where TPayload : new()
        where TResult : new();

        /// <summary>
        /// Tells the worker to stop polling for and handling ExternalTasks.
        /// </summary>
        void stop();
    }
}
