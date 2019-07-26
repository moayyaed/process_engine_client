namespace ProcessEngine.Client.Tests.xUnit {
    using System.IO;
    using System.Net.Http.Headers;
    using System.Net.Http;
    using System.Net;
    using System.Text;
    using System.Threading.Tasks;
    using System;

    using EssentialProjects.IAM.Contracts;

    using ProcessEngine.Client;

    using Newtonsoft.Json;

    public class ProcessEngineClientFixture {

        private string processEngineRestApiUrl;

        public ProcessEngineClientFixture()
        {
            this.DefaultIdentity = DummyIdentity.Create();

            CreateProcessEngineClient();
            DeploySampleBpmns();
        }

        public ProcessEngineClient ProcessEngineClient { get; private set; }

        public IIdentity DefaultIdentity { get; private set; }

        private void CreateProcessEngineClient()
        {
            var baseUrlFromEnv = Environment.GetEnvironmentVariable("PROCESS_ENGINE_REST_API_URL");
            var baseUrl = string.IsNullOrEmpty(baseUrlFromEnv)
                ? "http://localhost:8000"
                : baseUrlFromEnv;

            this.processEngineRestApiUrl = baseUrl;

            this.ProcessEngineClient = new ProcessEngineClient(this.processEngineRestApiUrl, this.DefaultIdentity );
        }

        private void DeploySampleBpmns()
        {
            // Deploy test files from ./bpmn folder. The property "Copy to output directory" has to be true for these files.
            foreach (var file in Directory.GetFiles("./bpmn")) {
                FileInfo bpmnFile = new FileInfo(file);

                var isBpmnFile = bpmnFile.Extension.ToLower().Equals(".bpmn");
                if (isBpmnFile) {
                    DeployTestBpmnFilesAsync(bpmnFile).GetAwaiter().GetResult();
                }
            }
        }

        private async Task DeployTestBpmnFilesAsync(FileInfo bpmnFile)
        {
            try {

                var httpClient = this.CreateHttpClient();

                var bpmnFileContent = File.ReadAllText(bpmnFile.FullName);
                var identity = DummyIdentity.Create();

                var importPayload = new {
                    name = bpmnFile.Name.Replace(bpmnFile.Extension, ""),
                    xml = bpmnFileContent,
                    overwriteExisting = true
                };

                var jsonImportPayload = JsonConvert.SerializeObject(importPayload);

                var response = await httpClient.PostAsync("api/deployment/v1/import_process_model", new StringContent(jsonImportPayload, Encoding.UTF8, "application/json"));

                if (response.StatusCode != HttpStatusCode.OK) {
                    throw new Exception($"ProcessEngine Rest API returned status {response.StatusCode}.");
                }

            } catch (Exception unknownException) {
                throw new Exception($"Cannot deploy BPMN file for base URL '{this.processEngineRestApiUrl}'. See inner exception for details.", unknownException);
            }
        }

        private HttpClient CreateHttpClient()
        {
            var httpClient = new HttpClient();
            httpClient.BaseAddress = new Uri(this.processEngineRestApiUrl);

            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", this.DefaultIdentity.Token);

            return httpClient;
        }
    }
}
