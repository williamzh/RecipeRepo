using System.Web;
using System.Web.Http;

namespace RecipeRepo.Api
{
    public class WebApiApplication : HttpApplication
    {
        protected void Application_Start()
        {
			// Initialize logging
			log4net.Config.XmlConfigurator.Configure();

			IocConfig.Configure();
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }
    }
}
