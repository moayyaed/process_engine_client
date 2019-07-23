namespace ProcessEngineClient.Contracts
{
    using ProcessEngineClient.Contracts.ClientAspects;

    /// <summary>
    /// API for starting and managing BMPN processes.
    /// </summary>
    public interface IProcessEngineClient :
        IEmptyActivityClient,
        IEventClient,
        IManualTaskClient,
        IProcessModelClient,
        IUserTaskClient
    { }
}
