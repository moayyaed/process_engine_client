namespace ProcessEngine.Client
{
    using System;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Text;
    using System.Threading.Tasks;

    using Newtonsoft.Json;
    using Newtonsoft.Json.Serialization;

    using ProcessEngine.ConsumerAPI.Contracts.DataModel;

    using ConsumerApiRestSettings = ProcessEngine.ConsumerAPI.Contracts.RestSettings;

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
            var payload = new ProcessStartRequestPayload<TRequestPayload>();
            payload.CallerId = request.ParentProcessInstanceId;
            payload.CorrelationId = request.CorrelationId;
            payload.InputValues = request.Payload;

            var response = await this.SendProcessStartRequest<TRequestPayload>(
                processModelId,
                startEventId,
                endEventId,
                startCallbackType,
                payload
            );

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
            var externalTaskHttpClient = new ExternalTaskHttpClient(this.HttpClient.BaseAddress.ToString());
            var externalTaskWorker = new ExternalTaskWorker(externalTaskHttpClient);

            // We must not await this, because this method runs in an infinite loop that never gets resolved until the "stop" command is given.
            externalTaskWorker.SubscribeToExternalTasksWithTopic<TPayload, TResult>(this.Identity, topic, maxTasks, timeout, handleAction);

            return externalTaskWorker;
        }

        private async Task<ProcessStartResponsePayload> SendProcessStartRequest<TRequestPayload>(
            string processModelId,
            string startEventId,
            string endEventId,
            StartCallbackType startCallbackType,
            ProcessStartRequestPayload<TRequestPayload> payload
        )
        where TRequestPayload : new()
        {
            var url = this.BuildStartProcessInstanceUrl(processModelId, startEventId, endEventId, startCallbackType);
            SetAuthenticationHeader(this.Identity);

            var serializedPayload = this.SerializePayload(payload);

            var response = await this.HttpClient.PostAsync(url, serializedPayload);

            return await DeserializeResposne<ProcessStartResponsePayload>(response);
        }

        private string BuildStartProcessInstanceUrl(string processModelId, string startEventId, string endEventId, StartCallbackType startCallbackType)
        {
            var endpoint = ConsumerApiRestSettings.Paths.StartProcessInstance
                .Replace(ConsumerApiRestSettings.Params.ProcessModelId, processModelId);

            var endpointWithParameters = $"${endpoint}?start_callback_type=${startCallbackType}";

            if (!String.IsNullOrEmpty(startEventId))
            {
                endpointWithParameters = $"${endpointWithParameters}&start_event_id=${startEventId}";
            }

            if (startCallbackType == StartCallbackType.CallbackOnEndEventReached)
            {
                endpointWithParameters = $"${endpointWithParameters}&end_event_id=${endEventId}";
            }

            var finalUrl = this.ApplyBaseConsumerApiUrl(endpointWithParameters);

            return finalUrl;
        }

        private string ApplyBaseConsumerApiUrl(string url)
        {
            return $"${ConsumerApiRestSettings.Endpoints.ConsumerAPI}${url}";
        }

        private void SetAuthenticationHeader(IIdentity identity)
        {
            this.HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", identity.Token);
        }

        private StringContent SerializePayload<TRequest>(TRequest request)
        {
            var settings = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };

            var serializedRequest = JsonConvert.SerializeObject(request, settings);
            var content = new StringContent(serializedRequest, Encoding.UTF8, "application/json");
            return content;
        }

        private async Task<TResponse> DeserializeResposne<TResponse>(HttpResponseMessage response)
        {
            var serializedResponse = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<TResponse>(serializedResponse);
        }
    }
}
