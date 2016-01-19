using System.Web.Mvc;
using Autofac;
using Autofac.Integration.Mvc;
using RecipeRepo.Common.Configuration;

namespace RecipeRepo.Web
{
	public static class IocConfig
	{
		public static void RegisterDependencies()
		{
			var container = SetUpContainer();
			DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
		}

		private static IContainer SetUpContainer()
		{
			var b = new ContainerBuilder();

			// Global registrations
			b.RegisterControllers(typeof(MvcApplication).Assembly).PropertiesAutowired();
			b.RegisterFilterProvider();

			// Common
			b.RegisterType<ConfigurationManager>().AsSelf();

			return b.Build();
		}
	}
}