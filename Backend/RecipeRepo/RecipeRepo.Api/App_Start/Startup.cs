using System;
using System.Web.Http;
using Microsoft.Owin;
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
			//app.UseOAuthBearerTokens(new OAuthAuthorizationServerOptions
			//{
			//	TokenEndpointPath = new PathString("/token"),
			//	Provider = GlobalConfiguration.Configuration.DependencyResolver.GetService(typeof(OAuthProvider)) as OAuthProvider,
			//	AccessTokenExpireTimeSpan = TimeSpan.FromDays(14),
			//	AllowInsecureHttp = true
			//});

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