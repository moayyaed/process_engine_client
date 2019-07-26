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

            Assert.Equal(processModel.ID, processModelId);
            Assert.Equal(processModel.StartEvents.ToList()[0].Id, "StartEvent_1");
            Assert.Equal(processModel.EndEvents.ToList()[0].Id, "EndEvent_Success");
        }
    }
}
