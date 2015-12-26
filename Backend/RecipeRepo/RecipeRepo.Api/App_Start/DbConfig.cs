using RecipeRepo.Integrations.Db;

namespace RecipeRepo.Api
{
	public static class DbConfig
	{
		public static void Configure()
		{
			DbClient.Initialize();
			DbClient.BuildIndices();
		}
	}
}