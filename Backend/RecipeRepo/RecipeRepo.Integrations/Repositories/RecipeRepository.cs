using System.Collections.Generic;
using System.Globalization;
using MongoDB.Driver;
using RecipeRepo.Integrations.Contract;
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
					IsSuccess = false,
					Message = "A recipe with the name " + recipe.Name + " already exists."
				};
			}

			Collection.InsertOne(recipe);

			return new ActionResponse { IsSuccess = true };
		}

		public ActionResponse<Recipe> Get(string id)
		{
			var hits = Collection.Find(FilterBuilder.Eq("Id", id));

			return new ActionResponse<Recipe>
			{
				IsSuccess = true,
				Data = hits.FirstOrDefault()
			};
		}

		public ActionResponse<IEnumerable<Recipe>> Find<TValue>(string fieldName, TValue value, int limit = 100)
		{
			var hits = Collection.Find(FilterBuilder.Eq(fieldName, value)).Sort(SortBuilder.Descending(fieldName)).Limit(limit);

			return new ActionResponse<IEnumerable<Recipe>>
			{
				IsSuccess = true,
				Data = hits.ToList()
			};
		}

		public ActionResponse<IEnumerable<Recipe>> Search(string query, int limit = 100)
		{
			var textFilter = FilterBuilder.Text(query, CultureInfo.CurrentCulture.TwoLetterISOLanguageName);

			var hits = Collection.Find(textFilter).Limit(limit);

			return new ActionResponse<IEnumerable<Recipe>>
			{
				IsSuccess = true,
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
					IsSuccess = false,
					Message = "Update failed. Could not find a recipe with a matching ID (" + recipe.Id + ")."
				};
			}

			return new ActionResponse
			{
				IsSuccess = true
			};
		}

		public ActionResponse Remove(string id)
		{
			var result = Collection.DeleteOne(FilterBuilder.Eq(r => r.Id, id));
			if (result.IsAcknowledged && result.DeletedCount == 0)
			{
				return new ActionResponse
				{
					IsSuccess = false,
					Message = "Delete failed. Could not find a recipe with a matching ID (" + id + ")."
				};
			}

			return new ActionResponse
			{
				IsSuccess = true
			};
		}
	}
}
