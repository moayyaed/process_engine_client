namespace ProcessEngine.Client
{
    using System;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Threading.Tasks;

    using ProcessEngine.ConsumerAPI.Contracts;
    using ProcessEngine.ConsumerAPI.Contracts.DataModel;
    using ProcessEngine.ExternalTaskAPI.Contracts;

    using EssentialProjects.IAM.Contracts;

    using ProcessEngine.Client.Contracts;

    public class ProcessEngineClient
    {
        private static IIdentity DummyIdentity = new Identity() {
            UserId = "ZHVtbXlfdG9rZW4=",
            Token = "dummy_token"
        };

        private HttpClient HttpClient { get; }

        private IIdentity Identity { get; set; }

        public ProcessEngineClient(string url)
            : this(url, DummyIdentity)
        {
        }

        public ProcessEngineClient(string url, IIdentity identity)
        {
            this.HttpClient = new HttpClient();
            this.HttpClient.BaseAddress = new Uri(url);
            this.Identity = identity;
        }

        public async Task<ProcessStartResponse<TResponsePayload>> StartProcessInstance<TResponsePayload>(
            string processModelId,
            string startEventId,
            string endEventId = "")
        where TResponsePayload : new()
        {
            var request = new ProcessStartRequest<object>();

            return await this.StartProcessInstance<object, TResponsePayload>(processModelId, startEventId, request, endEventId);
        }

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
                this.Identity,
                processModelId,
                startEventId,
                payload,
                callbackType,
                endEventId
            );

            var response = new ProcessStartResponse<TResponsePayload>(
                responsePayload.ProcessInstanceId,
                responsePayload.CorrelationId,
                responsePayload.EndEventId,
                (TResponsePayload)responsePayload.TokenPayload
            );

            return response;
        }

        public ExternalTaskWorker SubscribeToExternalTasksWithTopic<TPayload, TResult>(
            string topic,
            ExtendedHandleExternalTaskAction<TPayload, TResult> handleAction)
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
            ExtendedHandleExternalTaskAction<TPayload, TResult> handleAction)
        where TPayload : new()
        where TResult : new()
        {
            var externalTaskHttpClient = new ExternalTaskHttpClient(this.HttpClient.BaseAddress.ToString());
            var externalTaskWorker = new ExternalTaskWorker(externalTaskHttpClient);

            // We must not await this, because this method runs in an infinite loop that never gets resolved until the "stop" command is given.
            externalTaskWorker.SubscribeToExternalTasksWithTopic<TPayload, TResult>(this.Identity, topic, maxTasks, timeout, handleAction);

            return externalTaskWorker;
        }
    }
}
