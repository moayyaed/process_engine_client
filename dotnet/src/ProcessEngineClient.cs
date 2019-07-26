namespace ProcessEngine.Client
{
    using System;
    using System.Collections.Generic;
    using System.Net.Http;
    using System.Threading.Tasks;

    using ProcessEngine.ConsumerAPI.Contracts.DataModel;

    using EssentialProjects.IAM.Contracts;

    using ConsumerApiRestSettings = ProcessEngine.ConsumerAPI.Contracts.RestSettings;

    using ProcessEngine.Client.Contracts;

    public class ProcessEngineClient: IProcessEngineClient
    {

#region "Properties and Fields"
        private static IIdentity DummyIdentity = new Identity() {
            UserId = "ZHVtbXlfdG9rZW4=",
            Token = "dummy_token"
        };

        private HttpFacade HttpFacade { get; }

        private IIdentity Identity { get; set; }

#endregion

#region "Constructors"

        public ProcessEngineClient(string url)
            : this(url, DummyIdentity)
        {
        }

        public ProcessEngineClient(string url, IIdentity identity)
        {
            this.HttpFacade = new HttpFacade(url, identity);
            this.Identity = identity;
        }

#endregion

#region "Process Models"

        public async Task<ProcessModel> GetProcessModelById(string processModelId)
        {
            var endpoint = ConsumerApiRestSettings.Paths.ProcessModelById
                .Replace(ConsumerApiRestSettings.Params.ProcessModelId, processModelId);

            var parsedResult = await this.HttpFacade.GetProcessModelFromUrl(endpoint);

            return parsedResult;
        }

        public async Task<ProcessModel> GetProcessModelByProcessInstanceId(string processInstanceId)
        {
            var endpoint = ConsumerApiRestSettings.Paths.ProcessModelByProcessInstanceId
                .Replace(ConsumerApiRestSettings.Params.ProcessInstanceId, processInstanceId);

            var parsedResult = await this.HttpFacade.GetProcessModelFromUrl(endpoint);

            return parsedResult;
        }

        public async Task<IEnumerable<ProcessModel>> GetProcessModels()
        {
            var endpoint = ConsumerApiRestSettings.Paths.ProcessModels;

            var result = await this.HttpFacade.SendRequestAndExpectResult<ProcessModelList>(HttpMethod.Get, endpoint);

            return result.ProcessModels;
        }

        public async Task<IEnumerable<ProcessInstance>> GetProcessInstancesForClientIdentity()
        {
            var endpoint = ConsumerApiRestSettings.Paths.GetOwnProcessInstances;

            var result = await this.HttpFacade.SendRequestAndExpectResult<IEnumerable<ProcessInstance>>(HttpMethod.Get, endpoint);

            return result;
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

        public async Task<IEnumerable<CorrelationResult<TPayload>>> GetResultForProcessModelInCorrelation<TPayload>(
            string correlationId,
            string processModelId)
        where TPayload : new()
        {
            var endpoint = ConsumerApiRestSettings.Paths.GetProcessResultForCorrelation
                .Replace(ConsumerApiRestSettings.Params.CorrelationId, correlationId)
                .Replace(ConsumerApiRestSettings.Params.ProcessModelId, processModelId);

            var result = await this.HttpFacade.SendRequestAndExpectResult<IEnumerable<CorrelationResult<TPayload>>>(HttpMethod.Get, endpoint);

            return result;
        }

#endregion

#region "Events"

        public async Task<IEnumerable<Event>> GetSuspendedEventsForProcessModel(string processModelId)
        {
            var endpoint = ConsumerApiRestSettings.Paths.ProcessModelEvents
                .Replace(ConsumerApiRestSettings.Params.ProcessModelId, processModelId);

            var parsedResult = await this.HttpFacade.GetTriggerableEventsFromUrl(endpoint);

            return parsedResult.Events;
        }

        public async Task<IEnumerable<Event>> GetSuspendedEventsForCorrelation(string correlationId)
        {
            var endpoint = ConsumerApiRestSettings.Paths.CorrelationEvents
                .Replace(ConsumerApiRestSettings.Params.CorrelationId, correlationId);

            var parsedResult = await this.HttpFacade.GetTriggerableEventsFromUrl(endpoint);

            return parsedResult.Events;
        }

        public async Task<IEnumerable<Event>> GetSuspendedEventsForProcessModelInCorrelation(string processModelId, string correlationId)
        {
            var endpoint = ConsumerApiRestSettings.Paths.CorrelationEvents
                .Replace(ConsumerApiRestSettings.Params.ProcessModelId, processModelId)
                .Replace(ConsumerApiRestSettings.Params.CorrelationId, correlationId);

            var parsedResult = await this.HttpFacade.GetTriggerableEventsFromUrl(endpoint);

            return parsedResult.Events;
        }

        public async Task TriggerMessageEvent(string messageName)
        {
            await this.TriggerMessageEvent(messageName, new {});
        }

        public async Task TriggerMessageEvent<TPayload>(string messageName, TPayload payload)
        {
            var endpoint = ConsumerApiRestSettings.Paths.TriggerMessageEvent
                .Replace(ConsumerApiRestSettings.Params.EventName, messageName);

            await this.HttpFacade.SendRequestAndExpectNoResult(HttpMethod.Post, endpoint);
        }

        public async Task TriggerSignalEvent(string signalName)
        {
            await this.TriggerSignalEvent(signalName, new {});
        }

        public async Task TriggerSignalEvent<TPayload>(string signalName, TPayload payload)
        {
            var endpoint = ConsumerApiRestSettings.Paths.TriggerSignalEvent
                .Replace(ConsumerApiRestSettings.Params.EventName, signalName);

            await this.HttpFacade.SendRequestAndExpectNoResult(HttpMethod.Post, endpoint);
        }

#endregion

#region "EmptyActivities"

        public async Task<IEnumerable<EmptyActivity>> GetSuspendedEmptyActivitiesForProcessModel(string processModelId)
        {
            var endpoint = ConsumerApiRestSettings.Paths.ProcessModelEmptyActivities
                .Replace(ConsumerApiRestSettings.Params.ProcessModelId, processModelId);

            var parsedResult = await this.HttpFacade.GetEmptyActivitiesFromUrl(endpoint);

            return parsedResult.EmptyActivities;
        }

        public async Task<IEnumerable<EmptyActivity>> GetSuspendedEmptyActivitiesForProcessInstance(string processInstanceId)
        {
            var endpoint = ConsumerApiRestSettings.Paths.ProcessInstanceEmptyActivities
                .Replace(ConsumerApiRestSettings.Params.ProcessInstanceId, processInstanceId);

            var parsedResult = await this.HttpFacade.GetEmptyActivitiesFromUrl(endpoint);

            return parsedResult.EmptyActivities;
        }

        public async Task<IEnumerable<EmptyActivity>> GetSuspendedEmptyActivitiesForCorrelation(string correlationId)
        {
            var endpoint = ConsumerApiRestSettings.Paths.CorrelationEmptyActivities
                .Replace(ConsumerApiRestSettings.Params.CorrelationId, correlationId);

            var parsedResult = await this.HttpFacade.GetEmptyActivitiesFromUrl(endpoint);

            return parsedResult.EmptyActivities;
        }

        public async Task<IEnumerable<EmptyActivity>> GetSuspendedEmptyActivitiesForProcessModelInCorrelation(string processModelId, string correlationId)
        {
            var endpoint = ConsumerApiRestSettings.Paths.ProcessModelCorrelationEmptyActivities
                .Replace(ConsumerApiRestSettings.Params.ProcessModelId, processModelId)
                .Replace(ConsumerApiRestSettings.Params.CorrelationId, correlationId);

            var parsedResult = await this.HttpFacade.GetEmptyActivitiesFromUrl(endpoint);

            return parsedResult.EmptyActivities;
        }

        public async Task<IEnumerable<EmptyActivity>> GetSuspendedEmptyActivitiesForClientIdentity()
        {
            var endpoint = ConsumerApiRestSettings.Paths.GetOwnEmptyActivities;

            var parsedResult = await this.HttpFacade.GetEmptyActivitiesFromUrl(endpoint);

            return parsedResult.EmptyActivities;
        }

        public async Task FinishEmptyActivity(string processInstanceId, string correlationId, string emptyActivityInstanceId)
        {
            var endpoint = ConsumerApiRestSettings.Paths.FinishEmptyActivity
                .Replace(ConsumerApiRestSettings.Params.ProcessInstanceId, processInstanceId)
                .Replace(ConsumerApiRestSettings.Params.CorrelationId, correlationId)
                .Replace(ConsumerApiRestSettings.Params.EmptyActivityInstanceId, emptyActivityInstanceId);


            await this.HttpFacade.SendRequestAndExpectNoResult(HttpMethod.Post, endpoint);
        }

#endregion

#region "ExternalTasks"

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

    #endregion

#region "ManualTasks"

        public async Task<IEnumerable<ManualTask>> GetSuspendedManualTasksForProcessModel(string processModelId)
        {
            var endpoint = ConsumerApiRestSettings.Paths.ProcessModelManualTasks
                .Replace(ConsumerApiRestSettings.Params.ProcessModelId, processModelId);

            var parsedResult = await this.HttpFacade.GetManualTasksFromUrl(endpoint);

            return parsedResult.ManualTasks;
        }

        public async Task<IEnumerable<ManualTask>> GetSuspendedManualTasksForProcessInstance(string processInstanceId)
        {
            var endpoint = ConsumerApiRestSettings.Paths.ProcessInstanceManualTasks
                .Replace(ConsumerApiRestSettings.Params.ProcessInstanceId, processInstanceId);

            var parsedResult = await this.HttpFacade.GetManualTasksFromUrl(endpoint);

            return parsedResult.ManualTasks;
        }

        public async Task<IEnumerable<ManualTask>> GetSuspendedManualTasksForCorrelation(string correlationId)
        {
            var endpoint = ConsumerApiRestSettings.Paths.CorrelationManualTasks
                .Replace(ConsumerApiRestSettings.Params.CorrelationId, correlationId);

            var parsedResult = await this.HttpFacade.GetManualTasksFromUrl(endpoint);

            return parsedResult.ManualTasks;
        }

        public async Task<IEnumerable<ManualTask>> GetSuspendedManualTasksForProcessModelInCorrelation(string processModelId, string correlationId)
        {
            var endpoint = ConsumerApiRestSettings.Paths.ProcessModelCorrelationManualTasks
                .Replace(ConsumerApiRestSettings.Params.ProcessModelId, processModelId)
                .Replace(ConsumerApiRestSettings.Params.CorrelationId, correlationId);

            var parsedResult = await this.HttpFacade.GetManualTasksFromUrl(endpoint);

            return parsedResult.ManualTasks;
        }

        public async Task<IEnumerable<ManualTask>> GetSuspendedManualTasksForClientIdentity()
        {
            var endpoint = ConsumerApiRestSettings.Paths.GetOwnManualTasks;

            var parsedResult = await this.HttpFacade.GetManualTasksFromUrl(endpoint);

            return parsedResult.ManualTasks;
        }

        public async Task FinishManualTask(string processInstanceId, string correlationId, string manualTaskInstanceId)
        {
            var endpoint = ConsumerApiRestSettings.Paths.FinishManualTask
                .Replace(ConsumerApiRestSettings.Params.ProcessInstanceId, processInstanceId)
                .Replace(ConsumerApiRestSettings.Params.CorrelationId, correlationId)
                .Replace(ConsumerApiRestSettings.Params.ManualTaskInstanceId, manualTaskInstanceId);


            await this.HttpFacade.SendRequestAndExpectNoResult(HttpMethod.Post, endpoint);
        }

#endregion

#region "Private Helper Functions"

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

#endregion

    }
}
