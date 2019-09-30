namespace ProcessEngine.Client.Tests
{
    using System.Threading.Tasks;

    using ProcessEngine.Client.Contracts;
    using ProcessEngine.Client.Tests.xUnit;
    using ProcessEngine.ConsumerAPI.Contracts.DataModel;

    using Xunit;

    [Collection("ProcessEngineClient collection")]
    public class TriggerSignalEventTests : ProcessEngineBaseTest
    {
        private readonly ProcessEngineClientFixture fixture;

        public TriggerSignalEventTests(ProcessEngineClientFixture fixture)
        {
            this.fixture = fixture;
        }

        [Fact]
        public async Task BPMN_TriggerSignalEvent_ShouldContinueProcessWithSignalIntermediateCatchEvent()
        {
            var processModelId = "test_consumer_api_signal_event";
            var payload = new ProcessStartRequest<object>();
            var callbackType = StartCallbackType.CallbackOnProcessInstanceCreated;

            var processStartResponsePayload = await this
                .fixture
                .ProcessEngineClient
                .StartProcessInstance<object, object>(processModelId, "StartEvent_1", payload, callbackType);

            await Task.Delay(5000);

            var signalName = "test_signal_event";
            await this.fixture.ProcessEngineClient.TriggerSignalEvent(signalName);

            await Task.Delay(5000);

            var processResult = await this
                .fixture
                .ProcessEngineClient
                .GetResultForProcessModelInCorrelation<object>(processStartResponsePayload.CorrelationId, processModelId);

            Assert.NotEmpty(processResult.CorrelationResults);
        }

    }
}
