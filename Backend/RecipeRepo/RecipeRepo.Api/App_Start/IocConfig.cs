using System.Reflection;
using System.Web.Http;
using Autofac;
using Autofac.Integration.WebApi;
using RecipeRepo.Api.Core;
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

			// Core
			b.RegisterType<UserManager>().As<IUserManager>();
			b.RegisterType<RecipeStore>().As<IRecipeStore>();
			b.RegisterType<MetaStore>().As<IMetaStore>();

			// Security
			b.RegisterType<AuthService>().As<IAuthService>();
			b.RegisterType<ClaimContext>().As<IClaimContext>();

			// IO
			b.RegisterType<FileManager>().As<IFileManager>();
			b.RegisterType<JsonFileReader>().AsSelf();

			// Integrations
			b.RegisterType<DbClient>().As<IDbClient>();
			b.RegisterType<DbRepository<Recipe>>().As<IDbRepository<Recipe>>();
			b.RegisterType<DbRepository<User>>().As<IDbRepository<User>>();
			b.RegisterType<DbRepository<Meta>>().As<IDbRepository<Meta>>();

			return b.Build();
		}
	}
}