namespace ProcessEngine.Client.Tests
{
    using System.Threading.Tasks;

    using ProcessEngine.Client.Contracts;
    using ProcessEngine.Client.Tests.xUnit;
    using ProcessEngine.ConsumerAPI.Contracts.DataModel;

    using Xunit;

    [Collection("ProcessEngineClient collection")]
    public class GetSuspendedUserTasksForProcessInstanceTests : ProcessEngineBaseTest
    {
        private readonly ProcessEngineClientFixture fixture;

        public GetSuspendedUserTasksForProcessInstanceTests(ProcessEngineClientFixture fixture)
        {
            this.fixture = fixture;
        }

        [Fact]
        public async Task BPMN_GetSuspendedUserTasksForProcessInstance_ShouldFetchUserTaskList()
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
                .GetSuspendedUserTasksForProcessInstance(processInstance.ProcessInstanceId);

            Assert.NotEmpty(userTasks);
        }

    }
}
