namespace ProcessEngine.Client.Tests
{
    using System.Threading.Tasks;

    using ProcessEngine.Client.Contracts;
    using ProcessEngine.Client.Tests.xUnit;
    using ProcessEngine.ConsumerAPI.Contracts.DataModel;

    using Xunit;

    [Collection("ProcessEngineClient collection")]
    public class GetProcessInstancesForClientIdentity : ProcessEngineBaseTest
    {
        private readonly ProcessEngineClientFixture fixture;

        public GetProcessInstancesForClientIdentity(ProcessEngineClientFixture fixture)
        {
            this.fixture = fixture;
        }

        [Fact]
        public async Task BPMN_GetProcessInstancesForClientIdentity_ShouldGetProcessInstances()
        {
            var processModelId = "test_consumer_api_correlation_result";
            var payload = new ProcessStartRequest<object>();
            var callbackType = StartCallbackType.CallbackOnProcessInstanceCreated;

            var processInstance = await this
                .fixture
                .ProcessEngineClient
                .StartProcessInstance<object, object>(processModelId, "StartEvent_1", payload, callbackType);

            var processInstances = await this
                .fixture
                .ProcessEngineClient
                .GetProcessInstancesForClientIdentity();

            Assert.NotNull(processInstances);
        }
    }
}
