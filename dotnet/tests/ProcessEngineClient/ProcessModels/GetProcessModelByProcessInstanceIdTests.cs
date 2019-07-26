namespace ProcessEngine.Client.Tests
{
    using System.Threading.Tasks;

    using ProcessEngine.Client.Contracts;
    using ProcessEngine.Client.Tests.xUnit;
    using ProcessEngine.ConsumerAPI.Contracts.DataModel;

    using Xunit;

    [Collection("ProcessEngineClient collection")]
    public class GetProcessModelByProcessInstanceId : ProcessEngineBaseTest
    {
        private readonly ProcessEngineClientFixture fixture;

        public GetProcessModelByProcessInstanceId(ProcessEngineClientFixture fixture)
        {
            this.fixture = fixture;
        }

        [Fact]
        public async Task BPMN_GetProcessModelByProcessInstanceId_ShouldGetProcessModel()
        {
            var processModelId = "test_consumer_api_correlation_result";
            var payload = new ProcessStartRequest<object>();
            var callbackType = StartCallbackType.CallbackOnProcessInstanceCreated;

            var processStartResponsePayload = await this
                .fixture
                .ProcessEngineClient
                .StartProcessInstance<object, object>(processModelId, "StartEvent_1", payload, callbackType);

            Assert.NotNull(processStartResponsePayload);

            var processModel = await this
                .fixture
                .ProcessEngineClient
                .GetProcessModelByProcessInstanceId(processStartResponsePayload.ProcessInstanceId);

            Assert.NotNull(processModel);

            Assert.Equal(processModelId, processModel.ID);
            Assert.Equal("StartEvent_1", processModel.StartEvents[0].Id);
            Assert.Equal("EndEvent_Success", processModel.EndEvents[0].Id);
        }
    }
}
