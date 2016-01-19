using System;
using System.Configuration;
using System.Threading;
using System.Web.Http.Cors;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Microsoft.Owin.Security.OAuth;
using Owin;
using RecipeRepo.Api.Security;
using RecipeRepo.Integrations.Db;
using RecipeRepo.Integrations.Entities;
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
				Provider = new ApplicationOAuthProvider(new AuthService(new DbRepository<User>(new DbClient()))),
				AccessTokenExpireTimeSpan = TimeSpan.FromMinutes(int.Parse(ConfigurationManager.AppSettings["TokenTimeoutMinutes"])),
				AllowInsecureHttp = true
			});
		}
	}
}