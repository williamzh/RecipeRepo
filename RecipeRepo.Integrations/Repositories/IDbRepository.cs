﻿using System.Collections.Generic;
using RecipeRepo.Common.Contract;
using RecipeRepo.Integrations.Entities;

namespace RecipeRepo.Integrations.Repositories
{
	/// <summary>
	/// A simple, low-level interface for database interactions.
	/// </summary>
	public interface IDbRepository<TEntity> where TEntity : IDbEntity
	{
		/// <summary>
		/// Gets or sets the name of the database collection associated with the enity
		/// (i.e. "table"). Defaults to the type name, e.g. "item" if the type of 
		/// <see cref="TEntity"/> is "Item".
		/// </summary>
		string CollectionName { get; set; }

		/// <summary>
		/// Inserts the specified item into the database. 
		/// </summary>
		/// <param name="item"></param>
		/// <returns></returns>
		ActionResponse Add(TEntity item);

		/// <summary>
		/// Gets all items in the collection.
		/// Note: May use a lot of memory for large collections.
		/// </summary>
		/// <returns></returns>
		ActionResponse<IEnumerable<TEntity>> GetAll();

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
