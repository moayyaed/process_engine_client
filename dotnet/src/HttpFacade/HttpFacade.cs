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

    internal class HttpFacade
    {
        private HttpClient HttpClient { get; }

        private IIdentity Identity { get; set; }

        public HttpFacade(string url, IIdentity identity)
        {
            this.HttpClient = new HttpClient();
            this.HttpClient.BaseAddress = new Uri(url);
            this.Identity = identity;
        }

        public string EndpointAddress {
            get {
                return this.HttpClient.BaseAddress.ToString();
            }
        }

        public async Task<ProcessModel> GetProcessModelFromUrl(string url)
        {
            var result = await this.SendRequestAndExpectResult<ProcessModel>(HttpMethod.Get, url);

            return result;
        }

        public async Task<EventList> GetTriggerableEventsFromUrl(string url)
        {
            var result = await this.SendRequestAndExpectResult<EventList>(HttpMethod.Get, url);

            return result;
        }

        public async Task<EmptyActivityList> GetEmptyActivitiesFromUrl(string url)
        {
            var result = await this.SendRequestAndExpectResult<EmptyActivityList>(HttpMethod.Get, url);

            return result;
        }

        public async Task<ManualTaskList> GetManualTasksFromUrl(string url)
        {
            var result = await this.SendRequestAndExpectResult<ManualTaskList>(HttpMethod.Get, url);

            return result;
        }

        public async Task<UserTaskList> GetUserTasksFromUrl(string url)
        {
            var result = await this.SendRequestAndExpectResult<UserTaskList>(HttpMethod.Get, url);

            return result;
        }

        public async Task SendRequestAndExpectNoResult(HttpMethod method, string endpoint)
        {
            await this.SendRequestAndExpectNoResult<object>(method, endpoint, null);
        }

        public async Task SendRequestAndExpectNoResult<TRequest>(HttpMethod method, string endpoint, TRequest payload)
        {
            var url = this.ApplyBaseConsumerApiUrl(endpoint);

            var request = this.CreateRequestMessage<TRequest>(this.Identity, method, url, payload);
            var result = await this.HttpClient.SendAsync(request);

            if (!result.IsSuccessStatusCode)
            {
                throw new Exception($"Request failed: {result.ReasonPhrase}");
            }
        }

        public async Task<TResult> SendRequestAndExpectResult<TResult>(HttpMethod method, string endpoint)
        {
            return await this.SendRequestAndExpectResult<object, TResult>(method, endpoint, null);
        }

        public async Task<TResult> SendRequestAndExpectResult<TRequest, TResult>(HttpMethod method, string endpoint, TRequest payload)
        {
            var url = this.ApplyBaseConsumerApiUrl(endpoint);

            TResult parsedResult = default(TResult);

            var request = this.CreateRequestMessage<TRequest>(this.Identity, method, url, payload);
            var result = await this.HttpClient.SendAsync(request);

            if (result.IsSuccessStatusCode)
            {
                parsedResult = await this.DeserializeResponse<TResult>(result);
            }
            else
            {
                throw new Exception($"Request failed: {result.ReasonPhrase}");
            }

            return parsedResult;
        }

        public HttpRequestMessage CreateRequestMessage<TRequest>(IIdentity identity, HttpMethod method, string url, TRequest content = default(TRequest))
        {
            var hasNoIdentity = identity == null || identity.Token == null;
            if (hasNoIdentity)
            {
                throw new UnauthorizedAccessException();
            }

            var message = new HttpRequestMessage();

            message.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            message.Headers.Authorization = new AuthenticationHeaderValue("Bearer", identity.Token);

            message.RequestUri = new Uri(this.HttpClient.BaseAddress, url);
            message.Method = method;
            message.Content = content == null
                ? null
                : this.SerializePayload<TRequest>(content);

            return message;
        }

        public string ApplyBaseConsumerApiUrl(string url)
        {
            return $"${ConsumerApiRestSettings.Endpoints.ConsumerAPI}${url}";
        }

        public void SetAuthenticationHeader(IIdentity identity)
        {
            this.HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", identity.Token);
        }

        public StringContent SerializePayload<TRequest>(TRequest request)
        {
            var settings = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver()
            };

            var serializedRequest = JsonConvert.SerializeObject(request, settings);
            var content = new StringContent(serializedRequest, Encoding.UTF8, "application/json");
            return content;
        }

        public async Task<TResponse> DeserializeResponse<TResponse>(HttpResponseMessage response)
        {
            var serializedResponse = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<TResponse>(serializedResponse);
        }
    }
}
