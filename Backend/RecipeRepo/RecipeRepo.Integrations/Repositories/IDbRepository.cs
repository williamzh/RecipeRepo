using System.Collections.Generic;
using RecipeRepo.Common.Contract;
using RecipeRepo.Integrations.Entities;

namespace RecipeRepo.Integrations.Repositories
{
	public interface IDbRepository<TEntity>
	{
		/// <summary>
		/// Inserts the specified item into the database. 
		/// </summary>
		/// <param name="item"></param>
		/// <returns></returns>
		ActionResponse Add(TEntity item);

		/// <summary>
		/// Returns the item with the specified ID, or null if no such item exists.
		/// </summary>
		/// <param name="id"></param>
		/// <returns></returns>
		ActionResponse<TEntity> Get(string id);

		/// <summary>
		/// Returns a sequence of items matching the specified IDs, or an empty sequence 
		/// if no matching items exist.
		/// </summary>
		/// <param name="ids"></param>
		/// <returns></returns>
		ActionResponse<IEnumerable<TEntity>> Get(IEnumerable<string> ids);

		/// <summary>
		/// Performs a field search with the given value. 
		/// </summary>
		/// <typeparam name="TValue"></typeparam>
		/// <param name="fieldName"></param>
		/// <param name="value"></param>
		/// <param name="strategy"></param>
		/// <param name="limit"></param>
		/// <returns></returns>
		ActionResponse<IEnumerable<TEntity>> Find<TValue>(string fieldName, TValue value, MatchingStrategy strategy, int limit = 100);

		/// <summary>
		/// Performs a free text search with the provided query.
		/// </summary>
		/// <param name="query"></param>
		/// <param name="limit"></param>
		/// <returns></returns>
		ActionResponse<IEnumerable<TEntity>> Search(string query, int limit = 100);

		/// <summary>
		/// Updates the provided item.
		/// </summary>
		/// <param name="item"></param>
		/// <returns></returns>
		ActionResponse Update(TEntity item);

		/// <summary>
		/// Removes an item with the specified ID form the database.
		/// </summary>
		/// <param name="id"></param>
		/// <returns></returns>
		ActionResponse Remove(string id);
	}
}
