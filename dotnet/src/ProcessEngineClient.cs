namespace ProcessEngineClient
{
    using System;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Threading.Tasks;

    using ProcessEngine.ConsumerAPI.Client;
    using ProcessEngine.ConsumerAPI.Contracts;
    using ProcessEngine.ConsumerAPI.Contracts.DataModel;

    using ProcessEngine.ExternalTaskAPI.Client;
    using ProcessEngine.ExternalTaskAPI.Contracts;

    /// <summary>
    /// Client for interact with the process-engine
    /// </summary>
    public class ProcessEngineClient
    {
        private HttpClient HttpClient { get; }

        private Identity Identity { get; set; }

        private ConsumerApiClientService ConsumerApiClient { get; }

        private IExternalTaskAPI ExternalTaskApi { get; }

        /// <summary>
        /// Create a new instance for the given url.
        /// </summary>
        /// <param name="url">The url for accessing the process-engine client api.</param>
        public ProcessEngineClient(string url)
            : this(url, Identity.DefaultIdentity)
        {
        }

        /// <summary>
        /// Create a new instance for the given url.
        /// </summary>
        /// <param name="url">The url for accessing the process-engine client api.</param>
        /// <param name="identity">The identity to connect the process-engine with.</param>
        public ProcessEngineClient(string url, Identity identity)
        {
            this.HttpClient = new HttpClient();
            this.HttpClient.BaseAddress = new Uri(url);
            this.Identity = identity;

            this.ConsumerApiClient = new ConsumerApiClientService(this.HttpClient);

            this.ExternalTaskApi = new ExternalTaskApiClientService(this.HttpClient);
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="processModelId"></param>
        /// <param name="startEventId"></param>
        /// <param name="endEventId"></param>
        /// <returns></returns>
        public async Task<ProcessStartResponse<object>> StartProcessInstance(
            string processModelId,
            string startEventId,
            string endEventId = "")
        {
            var request = new ProcessStartRequest<object>();

            return await this.StartProcessInstance<object, object>(processModelId, startEventId, request, endEventId);
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="processModelId"></param>
        /// <param name="startEventId"></param>
        /// <param name="endEventId"></param>
        /// <typeparam name="TResponsePayload"></typeparam>
        /// <returns></returns>
        public async Task<ProcessStartResponse<TResponsePayload>> StartProcessInstance<TResponsePayload>(
            string processModelId,
            string startEventId,
            string endEventId = "")
        where TResponsePayload : new()
        {
            var request = new ProcessStartRequest<object>();

            return await this.StartProcessInstance<object, TResponsePayload>(processModelId, startEventId, request, endEventId);
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="processModelId"></param>
        /// <param name="startEventId"></param>
        /// <param name="request"></param>
        /// <param name="endEventId"></param>
        /// <typeparam name="TRequestPayload"></typeparam>
        /// <typeparam name="TResponsePayload"></typeparam>
        /// <returns></returns>
        public async Task<ProcessStartResponse<TResponsePayload>> StartProcessInstance<TRequestPayload, TResponsePayload>(
            string processModelId,
            string startEventId,
            ProcessStartRequest<TRequestPayload> request,
            string endEventId = "")
        where TRequestPayload : new()
        where TResponsePayload : new()
        {
            var callbackType = StartCallbackType.CallbackOnEndEventReached;

            var payload = new ProcessStartRequestPayload<TRequestPayload>();

            payload.CallerId = request.ParentProcessInstanceId;
            payload.CorrelationId = request.CorrelationId;
            payload.InputValues = request.Payload;

            var responsePayload = await this.ConsumerApiClient.StartProcessInstance<TRequestPayload>(
                this.Identity.InternalIdentity,
                processModelId,
                startEventId,
                payload,
                callbackType,
                endEventId);

            var response = new ProcessStartResponse<TResponsePayload>();
            response.ProcessInstanceId = responsePayload.ProcessInstanceId;
            response.CorrelationId = responsePayload.CorrelationId;
            response.EndEventId = responsePayload.EndEventId;

            try
            {
                response.Payload = (TResponsePayload)responsePayload.TokenPayload;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }

            return response;
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="topic"></param>
        /// <param name="maxTasks"></param>
        /// <param name="timeout"></param>
        /// <param name="handleAction"></param>
        /// <typeparam name="TPayload"></typeparam>
        /// <returns></returns>
        public ExternalTaskWorker SubscribeToExternalTasksWithTopic<TPayload>(
            string topic,
            int maxTasks,
            int timeout,
            HandleExternalTaskAction<TPayload> handleAction)
        where TPayload : new()
        {
            var externalTaskWorker = new ExternalTaskWorker(this.ExternalTaskApi);

            externalTaskWorker.WaitForHandle(this.Identity.ExternalTaskIdentity, topic, maxTasks, timeout, handleAction);

            return externalTaskWorker;
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="topic"></param>
        /// <param name="handleAction"></param>
        /// <typeparam name="TPayload"></typeparam>
        /// <returns></returns>
        public ExternalTaskWorker SubscribeToExternalTasksWithTopic<TPayload>(
            string topic,
            HandleExternalTaskAction<TPayload> handleAction)
        where TPayload : new()
        {
            var maxTasks = 10;
            var timeout = 1000;

            return this.SubscribeToExternalTasksWithTopic<TPayload>(topic, maxTasks, timeout, handleAction);
        }
    }
}
