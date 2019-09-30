namespace ProcessEngine.Client.Tests
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    using ProcessEngine.Client.Contracts;
    using ProcessEngine.Client.Tests.xUnit;
    using ProcessEngine.ConsumerAPI.Contracts.DataModel;

    using Xunit;

    [Collection("ProcessEngineClient collection")]
    public class GetResultForProcessModelInCorrelationTests : ProcessEngineBaseTest
    {
        private readonly ProcessEngineClientFixture fixture;

        public GetResultForProcessModelInCorrelationTests(ProcessEngineClientFixture fixture)
        {
            this.fixture = fixture;
        }

        [Fact]
        public async Task BPMN_GetResultForProcessModelInCorrelation_ShouldGetResultOfStaticProcess()
        {
            var processModelId = "test_consumer_api_correlation_result";
            var endEventId = "EndEvent_Success";
            var payload = new ProcessStartRequest<object>();
            var callbackType = StartCallbackType.CallbackOnEndEventReached;

            var processStartResponsePayload = await this
                .fixture
                .ProcessEngineClient
                .StartProcessInstance<object, object>(processModelId, "StartEvent_1", payload, callbackType, endEventId);

            var correlationResults = await this
                .fixture
                .ProcessEngineClient
                .GetResultForProcessModelInCorrelation<TestResult>(processStartResponsePayload.CorrelationId, processModelId);

            var expectedCorrelationResult = new CorrelationResult<TestResult>
            {
                TokenPayload = new TestResult()
                {
                    scriptOutput = "hello world"
                },
                CorrelationId = processStartResponsePayload.CorrelationId,
                EndEventId = endEventId
            };

            var actualCorrelationResult = new List<CorrelationResult<TestResult>>(correlationResults.CorrelationResults).FirstOrDefault();

            Assert.NotNull(actualCorrelationResult);

            Assert.Equal(expectedCorrelationResult.CorrelationId, actualCorrelationResult.CorrelationId);
            Assert.Equal(expectedCorrelationResult.EndEventId, actualCorrelationResult.EndEventId);
            Assert.Equal(expectedCorrelationResult.TokenPayload.scriptOutput, actualCorrelationResult.TokenPayload.scriptOutput);
        }
    }

    public class TestResult
    {
        public string scriptOutput { get; set; }
    }
}
