namespace ProcessEngine.Client.Tests
{
    using System.Linq;
    using System.Threading.Tasks;

    using ProcessEngine.Client.Tests.xUnit;

    using Xunit;

    [Collection("ProcessEngineClient collection")]
    public class GetProcessModelByIdTest : ProcessEngineBaseTest
    {
        private readonly ProcessEngineClientFixture fixture;

        public GetProcessModelByIdTest(ProcessEngineClientFixture fixture)
        {
            this.fixture = fixture;
        }

        [Fact]
        public async Task BPMN_GetProcessModelByIdTest_ShouldGetProcessModel()
        {
            var processModelId = "test_consumer_api_correlation_result";

            var processModel = await this
                .fixture
                .ProcessEngineClient
                .GetProcessModelById(processModelId);

            Assert.NotNull(processModel);

            Assert.Equal(processModelId, processModel.ID);
            Assert.Equal("StartEvent_1", processModel.StartEvents.ToList()[0].Id);
            Assert.Equal("EndEvent_Success", processModel.EndEvents.ToList()[0].Id);
        }
    }
}
