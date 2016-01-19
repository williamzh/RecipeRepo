namespace RecipeRepo.Common.Configuration
{
	public class ConfigurationManager
	{
		public virtual string GetAppSetting(string key)
		{
			return System.Configuration.ConfigurationManager.AppSettings[key];
		}
	}
}
