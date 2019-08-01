namespace ProcessEngine.Client.Tests
{
    using System;
    using System.Threading.Tasks;

    using ProcessEngine.Client.Contracts;
    using ProcessEngine.Client.Tests.xUnit;
    using ProcessEngine.ConsumerAPI.Contracts.DataModel;

    using Xunit;

    [Collection("ProcessEngineClient collection")]
    public class GetSuspendedManualTasksForCorrelationTests : ProcessEngineBaseTest
    {
        private readonly ProcessEngineClientFixture fixture;

        public GetSuspendedManualTasksForCorrelationTests(ProcessEngineClientFixture fixture)
        {
            this.fixture = fixture;
        }

        [Fact]
        public void GetSuspendedManualTasksForCorrelation_EmptyParameters_ShouldThrowException()
        {
            Assert.ThrowsAsync<ArgumentNullException>(async () => await this
                .fixture
                .ProcessEngineClient
                .GetSuspendedManualTasksForCorrelation("")
            );
        }

        [Fact]
        public void GetSuspendedManualTasksForCorrelation_ProcessModelNotFound_ShouldThrowException()
        {
            Assert.ThrowsAsync<Exception>(async () => await this
                .fixture
                .ProcessEngineClient
                .GetSuspendedManualTasksForCorrelation("Test"));
        }

        [Fact]
        public async Task BPMN_GetSuspendedManualTasksForCorrelation_ShouldFetchManualTaskList()
        {
            var processModelId = "test_consumer_api_manualtask";
            var payload = new ProcessStartRequest<object>();
            var callbackType = StartCallbackType.CallbackOnProcessInstanceCreated;

            var processInstance = await this
                .fixture
                .ProcessEngineClient
                .StartProcessInstance<object, object>(processModelId, "StartEvent_1", payload, callbackType);

            // Give the ProcessEngine time to reach the ManualTask
            await Task.Delay(1000);

            var manualTasks = await this
                .fixture
                .ProcessEngineClient
                .GetSuspendedManualTasksForCorrelation(processInstance.CorrelationId);

            Assert.NotEmpty(manualTasks);
        }
    }
}
