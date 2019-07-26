namespace ProcessEngine.Client.Tests
{
    using System.Linq;
    using System.Threading.Tasks;

    using ProcessEngine.Client.Contracts;
    using ProcessEngine.Client.Tests.xUnit;
    using ProcessEngine.ConsumerAPI.Contracts.DataModel;

    using Xunit;

    [Collection("ProcessEngineClient collection")]
    public class GetSuspendedEventsForProcessModelTests : ProcessEngineBaseTest
    {
        private readonly ProcessEngineClientFixture fixture;

        public GetSuspendedEventsForProcessModelTests(ProcessEngineClientFixture fixture)
        {
            this.fixture = fixture;
        }

        [Fact]
        public async Task BPMN_GetSuspendedEventsForProcessModel_ShouldFetchEventsOfRunningProcess()
        {
            var processModelId = "test_consumer_api_message_event";
            var payload = new ProcessStartRequest<object>();
            var callbackType = StartCallbackType.CallbackOnProcessInstanceCreated;

            var processStartResponsePayload = await this
                .fixture
                .ProcessEngineClient
                .StartProcessInstance<object, object>(processModelId, "StartEvent_1", payload, callbackType);

            await Task.Delay(1000);

            var events = await this
                .fixture
                .ProcessEngineClient
                .GetSuspendedEventsForProcessModel(processModelId);

            Assert.NotEmpty(events);

            var fetchedEvent = events.ElementAt(0);

            var expectedMessageName = "test_message_event";
            Assert.Equal(fetchedEvent.EventName, expectedMessageName);
        }
    }
}
