namespace ProcessEngine.Client.Tests
{
    using System;
    using System.Threading.Tasks;

    using ProcessEngine.Client.Contracts;
    using ProcessEngine.Client.Tests.xUnit;
    using ProcessEngine.ConsumerAPI.Contracts.DataModel;

    using Xunit;

  [Collection("ProcessEngineClient collection")]
    public class StartProcessInstanceTests : ProcessEngineBaseTest
    {
        private readonly ProcessEngineClientFixture fixture;

        public StartProcessInstanceTests(ProcessEngineClientFixture fixture)
        {
            this.fixture = fixture;
        }

        [Fact]
        public void StartProcessInstance_EmptyParameters_ShouldThrowException()
        {
            var payload = new ProcessStartRequest<object>();

            Assert.ThrowsAsync<ArgumentNullException>(async () => await this
                .fixture
                .ProcessEngineClient
                .StartProcessInstance<object, object>("", "Test", payload));
        }

        [Fact]
        public void StartProcessInstance_ProcessModelNotFound_ShouldThrowException()
        {
            var payload = new ProcessStartRequest<object>();

            Assert.ThrowsAsync<Exception>(async () => await this
                .fixture
                .ProcessEngineClient
                .StartProcessInstance<object, object>("Test", "Test", payload));
        }

        [Fact]
        public async Task BPMN_StartProcessInstance_ShouldCreateAndFinishProcess()
        {
            var processModelId = "test_start_process";
            var payload = new ProcessStartRequest<object>();
            var callbackType = StartCallbackType.CallbackOnEndEventReached;

            var processInstance = await this
                .fixture
                .ProcessEngineClient
                .StartProcessInstance<object, object>(processModelId, "StartEvent_1", payload, callbackType, "EndEvent_1");
        }

        [Fact]
        public async Task BPMN_StartProcessInstance_ShouldCreateProcessWithDistinctCorrelationId()
        {
            var processModelId = "test_start_process";
            var correlationId = "CorrelationId_1";
            var payload = new ProcessStartRequest<object>(correlationId, "");

            var processStartResponsePayload = await this
                .fixture
                .ProcessEngineClient
                .StartProcessInstance<object, object>(processModelId, "StartEvent_1", payload);

            Assert.Equal(processStartResponsePayload.CorrelationId, correlationId);
        }

        [Fact]
        public async Task BPMN_StartProcessInstance_ShouldCreateCorrelationIdIfNoneProvided()
        {
            var processModelId = "test_start_process";
            var payload = new ProcessStartRequest<object>();

            var processStartResponsePayload = await this
                .fixture
                .ProcessEngineClient
                .StartProcessInstance<object, object>(processModelId, "StartEvent_1", payload);

            Assert.NotEmpty(processStartResponsePayload.CorrelationId);
        }
    }
}
