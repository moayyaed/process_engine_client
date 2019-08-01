namespace ProcessEngine.Client.Tests
{
    using System;
    using System.Threading.Tasks;

    using ProcessEngine.Client.Contracts;
    using ProcessEngine.Client.Tests.xUnit;
    using ProcessEngine.ConsumerAPI.Contracts.DataModel;

    using Xunit;

    [Collection("ProcessEngineClient collection")]
    public class GetSuspendedUserTasksForCorrelationTests : ProcessEngineBaseTest
    {
        private readonly ProcessEngineClientFixture fixture;

        public GetSuspendedUserTasksForCorrelationTests(ProcessEngineClientFixture fixture)
        {
            this.fixture = fixture;
        }

        [Fact]
        public void GetSuspendedUserTasksForCorrelation_EmptyParameters_ShouldThrowException()
        {
            Assert.ThrowsAsync<ArgumentNullException>(async () => await this
                .fixture
                .ProcessEngineClient
                .GetSuspendedUserTasksForCorrelation("")
            );
        }

        [Fact]
        public void GetSuspendedUserTasksForCorrelation_ProcessModelNotFound_ShouldThrowException()
        {
            Assert.ThrowsAsync<Exception>(async () => await this
                .fixture
                .ProcessEngineClient
                .GetSuspendedUserTasksForCorrelation("Test"));
        }

        [Fact]
        public async Task BPMN_GetSuspendedUserTasksForCorrelation_ShouldFetchUserTaskList()
        {
            var processModelId = "test_consumer_api_usertask";
            var payload = new ProcessStartRequest<object>();
            var callbackType = StartCallbackType.CallbackOnProcessInstanceCreated;

            var processInstance = await this
                .fixture
                .ProcessEngineClient
                .StartProcessInstance<object, object>(processModelId, "StartEvent_1", payload, callbackType);

            // Give the ProcessEngine time to reach the UserTask
            await Task.Delay(1000);

            var userTasks = await this
                .fixture
                .ProcessEngineClient
                .GetSuspendedUserTasksForCorrelation(processInstance.CorrelationId);

            Assert.NotEmpty(userTasks);
        }

    }
}
