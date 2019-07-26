namespace ProcessEngine.Client.Tests
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    using ProcessEngine.Client.Contracts;
    using ProcessEngine.Client.Tests.xUnit;
    using ProcessEngine.ConsumerAPI.Contracts.DataModel;

    using Xunit;

    [Collection("ProcessEngineClient collection")]
    public class FinishUserTaskTests : ProcessEngineBaseTest
    {
        private readonly ProcessEngineClientFixture fixture;

        public FinishUserTaskTests(ProcessEngineClientFixture fixture)
        {
            this.fixture = fixture;
        }

        [Fact]
        public void FinishUserTask_EmptyParameters_ShouldThrowException()
        {
            Assert.ThrowsAsync<ArgumentNullException>(async () => await this
                .fixture
                .ProcessEngineClient
                .FinishUserTask("", "", "", null)
            );
        }

        [Fact]
        public void FinishUserTask_ProcessInstanceNotFound_ShouldThrowException()
        {
            Assert.ThrowsAsync<Exception>(async () => await this
                .fixture
                .ProcessEngineClient
                .FinishUserTask( "abc", "", "", null)
            );
        }

        [Fact]
        public async Task BPMN_FinishUserTask_ShouldFinishUserTask()
        {
            var processModelId = "test_consumer_api_usertask";
            var payload = new ProcessStartRequest<object>();
            var callbackType = StartCallbackType.CallbackOnProcessInstanceCreated;

            var processInstance = await this
                .fixture
                .ProcessEngineClient
                .StartProcessInstance<object, object>(processModelId, "StartEvent_1", payload, callbackType);

            // Give the ProcessEngine time to reach the UserTask
            await Task.Delay(5000);

            var userTasks = await this
                .fixture
                .ProcessEngineClient
                .GetSuspendedUserTasksForCorrelation(processInstance.CorrelationId);

            Assert.NotEmpty(userTasks);

            var userTaskToBeFinished = userTasks.ElementAt(0);
            var userTaskResult = new UserTaskResult()
            {
                FormFields = new Dictionary<string, object>()
            };

            userTaskResult.FormFields.Add("my_test_key", "my_test_value");

            await this
                .fixture
                .ProcessEngineClient
                .FinishUserTask(
                    processInstance.ProcessInstanceId,
                    processInstance.CorrelationId,
                    userTaskToBeFinished.FlowNodeInstanceId,
                    userTaskResult
                );
        }

    }
}
