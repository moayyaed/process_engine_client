namespace ProcessEngine.Client.Tests
{
    using System.Threading.Tasks;

    using ProcessEngine.Client.Contracts;
    using ProcessEngine.Client.Tests.xUnit;
    using ProcessEngine.ConsumerAPI.Contracts.DataModel;

    using Xunit;

    [Collection("ConsumerAPI collection")]
    public class GetSuspendedUserTasksForClientIdentityTests : ProcessEngineBaseTest
    {
        private readonly ProcessEngineClientFixture fixture;

        public GetSuspendedUserTasksForClientIdentityTests(ProcessEngineClientFixture fixture)
        {
            this.fixture = fixture;
        }

        [Fact]
        public async Task BPMN_GetSuspendedUserTasksForClientIdentity_ShouldFetchUserTaskList()
        {
            var processModelId = "test_consumer_api_usertask";
            var payload = new ProcessStartRequest<object>();
            var callbackType = StartCallbackType.CallbackOnProcessInstanceCreated;

            var processInstance = await this
                .fixture
                .ProcessEngineClient
                .StartProcessInstance<object, object>(processModelId, "StartEvent_1", payload, callbackType);

            // Give the ProcessEngine time to reach the UserTask
            await Task.Delay(2000);

            var userTasks = await this.fixture.ProcessEngineClient.GetSuspendedUserTasksForClientIdentity();

            Assert.NotEmpty(userTasks);
        }

    }
}
