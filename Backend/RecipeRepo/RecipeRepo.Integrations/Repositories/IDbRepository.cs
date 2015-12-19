using System.Collections.Generic;
using RecipeRepo.Integrations.Contract;

namespace RecipeRepo.Integrations.Repositories
{
	public interface IDbRepository<TEntity>
	{
		ActionResponse Add(TEntity recipe);
		ActionResponse<TEntity> Get(string id);
		ActionResponse<IEnumerable<TEntity>> Find<TValue>(string fieldName, TValue value, int limit = 100);
		ActionResponse<IEnumerable<TEntity>> Search(string query, int limit = 100);
		ActionResponse Update(TEntity recipe);
		ActionResponse Remove(string id);
	}
}
