using System.Reflection;
using System.Web.Http;
using Autofac;
using Autofac.Integration.WebApi;
using RecipeRepo.Api.IO;
using RecipeRepo.Api.Security;
using RecipeRepo.Integrations.Db;
using RecipeRepo.Integrations.Entities;
using RecipeRepo.Integrations.Repositories;

namespace RecipeRepo.Api
{
	public static class IocConfig
	{
		public static void Configure()
		{
			var config = GlobalConfiguration.Configuration;
			var container = SetUpContainer(config);

			config.DependencyResolver = new AutofacWebApiDependencyResolver(container);
		}

		private static IContainer SetUpContainer(HttpConfiguration config)
		{
			var b = new ContainerBuilder();

			// Global registrations
			b.RegisterApiControllers(Assembly.GetExecutingAssembly()).PropertiesAutowired();
			b.RegisterWebApiFilterProvider(config);

			// Security
			b.RegisterType<AuthService>().As<IAuthService>();
			b.RegisterType<ClaimContext>().As<IClaimContext>();

			// IO
			b.RegisterType<JsonFileReader>().AsSelf();

			// Integrations
			b.RegisterType<DbClient>().As<IDbClient>();
			b.RegisterType<RecipeRepository>().As<IDbRepository<Recipe>>();
			b.RegisterType<UserRepository>().As<IDbRepository<User>>();

			return b.Build();
		}
	}
}