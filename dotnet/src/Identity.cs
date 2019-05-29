namespace ProcessEngineClient
{
    using System;
    using System.Text;

    using EssentialProjects.IAM.Contracts;

    using IAMIdentity = EssentialProjects.IAM.Contracts.Identity;

    using ExternalTaskIdentity = ProcessEngine.ExternalTaskAPI.Contracts.Identity;

    /// <summary>
    /// The identity
    /// </summary>
    public class Identity 
    {
        /// <summary>
        /// Identity for using with the local process-engine.
        /// </summary>
        /// <returns></returns>
        public static Identity DefaultIdentity = new Identity("dummy_token");

        internal IIdentity InternalIdentity { get; }

        internal ExternalTaskIdentity ExternalTaskIdentity { get; }

        /// <summary>
        /// Create the Identity for the given token
        /// </summary>
        /// <param name="token">The token to use with the identity.</param>
        public Identity(string token) 
        {
            var preparedToken = Convert.ToBase64String(Encoding.UTF8.GetBytes(token));

            this.InternalIdentity = new IAMIdentity() { Token = preparedToken };

            this.ExternalTaskIdentity  = new ExternalTaskIdentity() { Token = preparedToken };
        }
    }
}
