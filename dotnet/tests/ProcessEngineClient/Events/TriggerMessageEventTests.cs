namespace ProcessEngine.Client.Tests
{
    using System.Threading.Tasks;

    using ProcessEngine.Client.Contracts;
    using ProcessEngine.Client.Tests.xUnit;
    using ProcessEngine.ConsumerAPI.Contracts.DataModel;

    using Xunit;

    [Collection("ProcessEngineClient collection")]
    public class TriggerMessageEventTests : ProcessEngineBaseTest
    {
        private readonly ProcessEngineClientFixture fixture;

        public TriggerMessageEventTests(ProcessEngineClientFixture fixture)
        {
            this.fixture = fixture;
        }

        [Fact]
        public async Task BPMN_TriggerMessageEvent_ShouldContinueProcessWithMessageIntermediateCatchEvent()
        {
            var processModelId = "test_consumer_api_message_event";
            var payload = new ProcessStartRequest<object>();
            var callbackType = StartCallbackType.CallbackOnProcessInstanceCreated;

            var processStartResponsePayload = await this
                .fixture
                .ProcessEngineClient
                .StartProcessInstance<object, object>(processModelId, "StartEvent_1", payload, callbackType);

            await Task.Delay(5000);

            var messageName = "test_message_event";
            await this.fixture.ProcessEngineClient.TriggerMessageEvent(messageName);

            await Task.Delay(5000);

            var processResult = await this
                .fixture
                .ProcessEngineClient
                .GetResultForProcessModelInCorrelation<object>(processStartResponsePayload.CorrelationId, processModelId);

            Assert.NotEmpty(processResult.CorrelationResults);
        }

    }
}
