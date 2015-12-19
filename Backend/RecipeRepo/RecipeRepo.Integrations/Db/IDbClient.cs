using MongoDB.Driver;

namespace RecipeRepo.Integrations.Db
{
	public interface IDbClient
	{
		IMongoCollection<T> GetCollection<T>(string collectionName);
	}
}
