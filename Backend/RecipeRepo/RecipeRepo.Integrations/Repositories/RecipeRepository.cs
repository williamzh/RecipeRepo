using System.Collections.Generic;
using System.Globalization;
using MongoDB.Driver;
using RecipeRepo.Common.Contract;
using RecipeRepo.Integrations.Db;
using RecipeRepo.Integrations.Entities;

namespace RecipeRepo.Integrations.Repositories
{
	public class RecipeRepository : IDbRepository<Recipe>
	{
		private readonly IDbClient _dbClient;

		public RecipeRepository(IDbClient dbClient)
		{
			_dbClient = dbClient;
		}

		private IMongoCollection<Recipe> Collection { get { return _dbClient.GetCollection<Recipe>("recipes"); } }
		private FilterDefinitionBuilder<Recipe> FilterBuilder { get { return Builders<Recipe>.Filter; } }
		private SortDefinitionBuilder<Recipe> SortBuilder { get { return Builders<Recipe>.Sort; } }

		public ActionResponse Add(Recipe recipe)
		{
			var filter = FilterBuilder.Eq("Name", recipe.Name);
			if (Collection.Find(filter).Any())
			{
				return new ActionResponse
				{
					Code = AppStatusCode.DuplicateExists,
					Message = "A recipe with the name " + recipe.Name + " already exists."
				};
			}

			Collection.InsertOne(recipe);

			return new ActionResponse { Code = AppStatusCode.Ok };
		}

		public ActionResponse<Recipe> Get(string id)
		{
			var hits = Collection.Find(FilterBuilder.Eq("Id", id));

			return new ActionResponse<Recipe>
			{
				Code = AppStatusCode.Ok,
				Data = hits.FirstOrDefault()
			};
		}

		public ActionResponse<IEnumerable<Recipe>> Get(IEnumerable<string> ids)
		{
			var hits = Collection.Find(FilterBuilder.In("Id", ids));

			return new ActionResponse<IEnumerable<Recipe>>
			{
				Code = AppStatusCode.Ok,
				Data = hits.ToList()
			};
		}

		public ActionResponse<IEnumerable<Recipe>> Find<TValue>(string fieldName, TValue value, MatchingStrategy strategy, int limit = 100)
		{
			FilterDefinition<Recipe> filter;
			switch (strategy)
			{
				case MatchingStrategy.LessThan:
					filter = FilterBuilder.Lt(fieldName, value);
					break;
				case MatchingStrategy.GreaterThan:
					filter = FilterBuilder.Gt(fieldName, value);
					break;
				default:
					filter = FilterBuilder.Eq(fieldName, value);
					break;
			}

			var hits = Collection.Find(filter).Sort(SortBuilder.Descending(fieldName)).Limit(limit);

			return new ActionResponse<IEnumerable<Recipe>>
			{
				Code = AppStatusCode.Ok,
				Data = hits.ToList()
			};
		}

		public ActionResponse<IEnumerable<Recipe>> Search(string query, int limit = 100)
		{
			var textFilter = FilterBuilder.Text(query, CultureInfo.CurrentCulture.TwoLetterISOLanguageName);

			var hits = Collection.Find(textFilter).Limit(limit);

			return new ActionResponse<IEnumerable<Recipe>>
			{
				Code = AppStatusCode.Ok,
				Data = hits.ToList()
			};
		}

		public ActionResponse Update(Recipe recipe)
		{
			var result = Collection.ReplaceOne(r => r.Id == recipe.Id, recipe);
			if (result.IsAcknowledged && result.ModifiedCount == 0)
			{
				return new ActionResponse
				{
					Code = AppStatusCode.EntityNotFound,
					Message = "Update failed. Could not find a recipe with a matching ID (" + recipe.Id + ")."
				};
			}

			return new ActionResponse
			{
				Code = AppStatusCode.Ok
			};
		}

		public ActionResponse Remove(string id)
		{
			var result = Collection.DeleteOne(FilterBuilder.Eq(r => r.Id, id));
			if (result.IsAcknowledged && result.DeletedCount == 0)
			{
				return new ActionResponse
				{
					Code = AppStatusCode.EntityNotFound,
					Message = "Delete failed. Could not find a recipe with a matching ID (" + id + ")."
				};
			}

			return new ActionResponse
			{
				Code = AppStatusCode.Ok
			};
		}
	}
}
