using System.Reflection;
using System.Web.Http;
using Autofac;
using Autofac.Integration.WebApi;
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
			b.RegisterApiControllers(Assembly.GetExecutingAssembly());
			b.RegisterWebApiFilterProvider(config);

			// Integrations
			b.RegisterType<DbClient>().As<IDbClient>();
			b.RegisterType<RecipeRepository>().As<IDbRepository<Recipe>>();

			return b.Build();
		}
	}
}