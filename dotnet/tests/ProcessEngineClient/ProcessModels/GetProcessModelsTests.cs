namespace ProcessEngine.Client.Tests
{
    using System.Threading.Tasks;

    using ProcessEngine.Client.Tests.xUnit;

    using Xunit;

    [Collection("ProcessEngineClient collection")]
    public class GetProcessModels : ProcessEngineBaseTest
    {
        private readonly ProcessEngineClientFixture fixture;

        public GetProcessModels(ProcessEngineClientFixture fixture)
        {
            this.fixture = fixture;
        }

        [Fact]
        public async Task BPMN_GetProcessModels_ShouldGetProcessModels()
        {
            var processModels = await this
                .fixture
                .ProcessEngineClient
                .GetProcessModels();

            Assert.NotEmpty(processModels);
        }
    }
}
