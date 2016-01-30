using System.Configuration;

namespace RecipeRepo.Web.Configuration
{
	public class ClientSettings
	{
		public string AppServerUrl { get { return ConfigurationManager.AppSettings["appServerUrl"]; } }
	}
}