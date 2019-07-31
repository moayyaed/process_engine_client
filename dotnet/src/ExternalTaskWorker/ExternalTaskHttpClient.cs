namespace ProcessEngine.Client
{
    using System.Collections.Generic;
    using System.Net.Http;
    using System.Threading.Tasks;

    using EssentialProjects.IAM.Contracts;

    using ProcessEngine.ExternalTaskAPI.Contracts;

    /// <summary>
    /// This Client is used exclusively by the ExternalTaskWorker.
    /// It accesses the ProcessEngine's HTTP endpoints for managing ExternalTasks.
    /// </summary>
    public class ExternalTaskHttpClient : IExternalTaskAPI
    {
        private HttpFacade HttpFacade { get; }

        public ExternalTaskHttpClient(string processEngineUrl)
        {
            var externalTaskApiEndpoint = "/api/external_task/v1";
            this.HttpFacade = new HttpFacade(processEngineUrl, externalTaskApiEndpoint);
        }

        public async Task ExtendLock(IIdentity identity, string workerId, string externalTaskId, int additionalDuration)
        {
            var uri = $"task/{externalTaskId}/extend_lock";
            var request = new ExtendLockRequest
            (
                workerId,
                additionalDuration
            );

            await this.SendPostToExternalTaskApi(identity, uri, request);
        }

        public async Task<IEnumerable<ExternalTask<TPayload>>> FetchAndLockExternalTasks<TPayload>(IIdentity identity, string workerId, string topicName, int maxTasks, int longPollingTimeout, int lockDuration) where TPayload : new()
        {
            var uri = "fetch_and_lock";
            var request = new FetchAndLockRequest
            (
                workerId,
                topicName,
                maxTasks,
                longPollingTimeout,
                lockDuration
            );

            return await this.SendPostToExternalTaskApi<FetchAndLockRequest, IEnumerable<ExternalTask<TPayload>>>(identity, uri, request);
        }

        public async Task FinishExternalTask<TPayload>(IIdentity identity, string workerId, string externalTaskId, TPayload payload)
        {
            var uri = $"task/{externalTaskId}/finish";

            var request = new FinishExternalTaskRequest<TPayload>
            (
                workerId,
                payload
            );

            await this.SendPostToExternalTaskApi(identity, uri, request);
        }

        public async Task HandleBpmnError(IIdentity identity, string workerId, string externalTaskId, string errorCode)
        {
            var uri = $"task/{externalTaskId}/handle_bpmn_error";

            var request = new HandleBpmnErrorRequest
            (
                workerId,
                errorCode
            );

            await this.SendPostToExternalTaskApi(identity, uri, request);
        }

        public async Task HandleServiceError(IIdentity identity, string workerId, string externalTaskId, string errorMessage, string errorDetails)
        {
            var uri = $"task/{externalTaskId}/handle_service_error";

            var request = new HandleServiceErrorRequest
            (
                workerId,
                errorMessage,
                errorDetails
            );

            await this.SendPostToExternalTaskApi(identity, uri, request);
        }

        public void Dispose()
        {
            this.HttpFacade.Dispose();
        }

        private async Task SendPostToExternalTaskApi<TRequest>(IIdentity identity, string uri, TRequest request)
        {
            await this.HttpFacade.SendRequestAndExpectNoResult<TRequest>(HttpMethod.Post, uri, request, identity);
        }

        private async Task<TResponse> SendPostToExternalTaskApi<TRequest, TResponse>(IIdentity identity, string uri, TRequest request)
        {
            return await this.HttpFacade.SendRequestAndExpectResult<TRequest, TResponse>(HttpMethod.Post, uri, request, identity);
        }
    }
}
