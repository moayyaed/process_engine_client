namespace ProcessEngine.Client.Tests.xUnit {

    using Xunit;

    // https://xunit.github.io/docs/shared-context

    [CollectionDefinition ("ProcessEngineClient collection")]
    public class ProcessEngineClientTestCollection : ICollectionFixture<ProcessEngineClientFixture> { }
}
