using System;
using System.Configuration;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Cors;
using System.Web.Http;
using System.Web.Http.Cors;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Microsoft.Owin.Security.OAuth;
using Owin;
using RecipeRepo.Api.Security;
using RecipeRepo.Integrations.Db;
using RecipeRepo.Integrations.Repositories;

[assembly: OwinStartup(typeof(RecipeRepo.Api.Startup))]
namespace RecipeRepo.Api
{
	public class Startup
	{
		public void Configuration(IAppBuilder app)
		{
			var corsPolicy = new EnableCorsAttribute(ConfigurationManager.AppSettings["AllowedCorsUrls"], "*", "*");

			app.UseCors(new CorsOptions
			{
				PolicyProvider = new CorsPolicyProvider
				{
					PolicyResolver = request => corsPolicy.GetCorsPolicyAsync(null, CancellationToken.None)
				}
			});

			app.UseOAuthBearerTokens(new OAuthAuthorizationServerOptions
			{
				TokenEndpointPath = new PathString("/token"),
				Provider = new ApplicationOAuthProvider(new AuthService(new UserRepository(new DbClient()))), 
				//Provider = GlobalConfiguration.Configuration.DependencyResolver.GetService(typeof(ApplicationOAuthProvider)) as ApplicationOAuthProvider,
				AccessTokenExpireTimeSpan = TimeSpan.FromDays(14),
				AllowInsecureHttp = true
			});
		}
	}
}