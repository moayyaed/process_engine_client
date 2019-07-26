namespace ProcessEngine.Client
{
    using System;
    using System.Net.Http;
    using System.Threading.Tasks;

    using ProcessEngine.ConsumerAPI.Contracts.DataModel;

    using EssentialProjects.IAM.Contracts;

    using ConsumerApiRestSettings = ProcessEngine.ConsumerAPI.Contracts.RestSettings;

    using ProcessEngine.Client.Contracts;

    public class ProcessEngineClient: IProcessEngineClient
    {
        private static IIdentity DummyIdentity = new Identity() {
            UserId = "ZHVtbXlfdG9rZW4=",
            Token = "dummy_token"
        };

        private HttpFacade HttpFacade { get; }

        private IIdentity Identity { get; set; }

        public ProcessEngineClient(string url)
            : this(url, DummyIdentity)
        {
        }

        public ProcessEngineClient(string url, IIdentity identity)
        {
            this.HttpFacade = new HttpFacade(url, identity);
            this.Identity = identity;
        }

        public async Task<ProcessStartResponse<TResponsePayload>> StartProcessInstance<TResponsePayload>(
            string processModelId,
            string startEventId,
            StartCallbackType startCallbackType = StartCallbackType.CallbackOnProcessInstanceCreated,
            string endEventId = "")
        where TResponsePayload : new()
        {
            var request = new ProcessStartRequest<object>();

            return await this.StartProcessInstance<object, TResponsePayload>(processModelId, startEventId, request, startCallbackType, endEventId);
        }

        public async Task<ProcessStartResponse<TResponsePayload>> StartProcessInstance<TRequestPayload, TResponsePayload>(
            string processModelId,
            string startEventId,
            ProcessStartRequest<TRequestPayload> request,
            StartCallbackType startCallbackType = StartCallbackType.CallbackOnProcessInstanceCreated,
            string endEventId = ""
        )
        where TRequestPayload : new()
        where TResponsePayload : new()
        {
            var noEndEventIdProvided = startCallbackType == StartCallbackType.CallbackOnEndEventReached &&
                String.IsNullOrEmpty(endEventId);

            if (noEndEventIdProvided)
            {
                throw new ArgumentNullException(nameof(endEventId), "Must provide an EndEventId, when using callback type 'CallbackOnEndEventReached'!");
            }

            var payload = new ProcessStartRequestPayload<TRequestPayload>();
            payload.CallerId = request.ParentProcessInstanceId;
            payload.CorrelationId = request.CorrelationId;
            payload.InputValues = request.Payload;

            var url = this.BuildStartProcessInstanceUrl(processModelId, startEventId, endEventId, startCallbackType);

            var response = await this.HttpFacade.SendRequestAndExpectResult<ProcessStartRequestPayload<TRequestPayload>, ProcessStartResponsePayload>(HttpMethod.Post, url, payload);

            var parsedResponse = new ProcessStartResponse<TResponsePayload>(
                response.ProcessInstanceId,
                response.CorrelationId,
                response.EndEventId,
                (TResponsePayload)response.TokenPayload
            );

            return parsedResponse;
        }

        public ExternalTaskWorker SubscribeToExternalTasksWithTopic<TPayload, TResult>(
            string topic,
            ExtendedHandleExternalTaskAction<TPayload, TResult> handleAction
        )
        where TPayload : new()
        where TResult : new()
        {
            var maxTasks = 10;
            var timeout = 1000;

            return this.SubscribeToExternalTasksWithTopic<TPayload, TResult>(topic, maxTasks, timeout, handleAction);
        }

        public ExternalTaskWorker SubscribeToExternalTasksWithTopic<TPayload, TResult>(
            string topic,
            int maxTasks,
            int timeout,
            ExtendedHandleExternalTaskAction<TPayload, TResult> handleAction
        )
        where TPayload : new()
        where TResult : new()
        {
            var externalTaskHttpClient = new ExternalTaskHttpClient(this.HttpFacade.EndpointAddress);
            var externalTaskWorker = new ExternalTaskWorker(externalTaskHttpClient);

            // We must not await this, because this method runs in an infinite loop that never gets resolved until the "stop" command is given.
            externalTaskWorker.SubscribeToExternalTasksWithTopic<TPayload, TResult>(this.Identity, topic, maxTasks, timeout, handleAction);

            return externalTaskWorker;
        }

        private string BuildStartProcessInstanceUrl(string processModelId, string startEventId, string endEventId, StartCallbackType startCallbackType)
        {
            var endpoint = ConsumerApiRestSettings.Paths.StartProcessInstance
                .Replace(ConsumerApiRestSettings.Params.ProcessModelId, processModelId);

            var url = $"${endpoint}?start_callback_type=${startCallbackType}";

            if (!String.IsNullOrEmpty(startEventId))
            {
                url = $"${url}&start_event_id=${startEventId}";
            }

            if (startCallbackType == StartCallbackType.CallbackOnEndEventReached)
            {
                url = $"${url}&end_event_id=${endEventId}";
            }

            return url;
        }
    }
}
