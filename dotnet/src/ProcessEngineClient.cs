namespace ProcessEngineClient
{
    using System;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Threading.Tasks;

    using ProcessEngine.ConsumerAPI.Contracts;
    using ProcessEngine.ConsumerAPI.Contracts.DataModel;
    using ProcessEngine.ExternalTaskAPI.Contracts;

    using EssentialProjects.IAM.Contracts;

    using ProcessEngineClient.Contracts;

    public class ProcessEngineClient
    {
        private HttpClient HttpClient { get; }

        private IIdentity Identity { get; set; }

        public ProcessEngineClient(string url)
            : this(url, Identity.DefaultIdentity)
        {
        }

        public ProcessEngineClient(string url, Identity identity)
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
                this.Identity.InternalIdentity,
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

        public ExternalTaskWorker SubscribeToExternalTasksWithTopic<TPayload>(
            string topic,
            HandleExternalTaskAction<TPayload> handleAction)
        where TPayload : new()
        {
            var maxTasks = 10;
            var timeout = 1000;

            return this.SubscribeToExternalTasksWithTopic<TPayload>(topic, maxTasks, timeout, handleAction);
        }

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
    }
}
