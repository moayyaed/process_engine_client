namespace ProcessEngine.Client
{
    using System;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Text;
    using System.Threading.Tasks;

    using Newtonsoft.Json;
    using Newtonsoft.Json.Serialization;

    using EssentialProjects.IAM.Contracts;

    internal class HttpFacade
    {
        private HttpClient HttpClient { get; }

        private IIdentity Identity { get; set; }

        private string ApiEndpoint { get; set; }

        public HttpFacade(string processEngineUrl, string apiEndpoint)
            : this(processEngineUrl, apiEndpoint, null)
        {
        }

        public HttpFacade(string processEngineUrl, string apiEndpoint, IIdentity identity)
        {
            this.ApiEndpoint = apiEndpoint;
            this.HttpClient = new HttpClient();
            this.HttpClient.BaseAddress = new Uri(processEngineUrl);
            this.Identity = identity;
        }

        public void Dispose()
        {
            this.HttpClient.Dispose();
        }

        public async Task SendRequestAndExpectNoResult(HttpMethod method, string endpoint, IIdentity identity = null)
        {
            await this.SendRequestAndExpectNoResult<object>(method, endpoint, identity, null);
        }

        public async Task SendRequestAndExpectNoResult<TRequest>(HttpMethod method, string endpoint, TRequest payload, IIdentity identity = null)
        {
            var identityToUse = identity == null ? this.Identity : identity;
            var request = this.CreateRequestMessage<TRequest>(identityToUse, method, endpoint, payload);
            var result = await this.HttpClient.SendAsync(request);

            if (!result.IsSuccessStatusCode)
            {
                throw new Exception($"Request failed: {result.ReasonPhrase}");
            }
        }

        public async Task<TResult> SendRequestAndExpectResult<TResult>(HttpMethod method, string endpoint, IIdentity identity = null)
        {
            return await this.SendRequestAndExpectResult<object, TResult>(method, endpoint, identity, null);
        }

        public async Task<TResult> SendRequestAndExpectResult<TRequest, TResult>(HttpMethod method, string endpoint, TRequest payload, IIdentity identity = null)
        {
            var identityToUse = identity == null ? this.Identity : identity;
            var request = this.CreateRequestMessage<TRequest>(identityToUse, method, endpoint, payload);
            var result = await this.HttpClient.SendAsync(request);

            TResult parsedResult = default(TResult);

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

        private HttpRequestMessage CreateRequestMessage<TRequest>(IIdentity identity, HttpMethod method, string url, TRequest content = default(TRequest))
        {
            var hasNoIdentity = identity == null || identity.Token == null;
            if (hasNoIdentity)
            {
                throw new UnauthorizedAccessException();
            }

            var message = new HttpRequestMessage();

            message.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            message.Headers.Authorization = new AuthenticationHeaderValue("Bearer", identity.Token);

            message.RequestUri = new Uri(this.HttpClient.BaseAddress, $"{this.ApiEndpoint}{url}");
            message.Method = method;
            message.Content = content == null
                ? null
                : this.SerializePayload<TRequest>(content);

            return message;
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

        private async Task<TResponse> DeserializeResponse<TResponse>(HttpResponseMessage response)
        {
            var serializedResponse = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<TResponse>(serializedResponse);
        }
    }
}
