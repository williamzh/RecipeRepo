using System.Collections.Generic;
using System.Globalization;
using MongoDB.Driver;
using RecipeRepo.Common.Contract;
using RecipeRepo.Integrations.Db;
using RecipeRepo.Integrations.Entities;

namespace RecipeRepo.Integrations.Repositories
{
	public class DbRepository<TEntity> : IDbRepository<TEntity> where TEntity : IDbEntity
	{
		private readonly IDbClient _dbClient;
		private string _collectionName;

		public DbRepository(IDbClient dbClient)
		{
			_dbClient = dbClient;
		}

		private IMongoCollection<TEntity> Collection { get { return _dbClient.GetCollection<TEntity>(CollectionName); } }
		private FilterDefinitionBuilder<TEntity> FilterBuilder { get { return Builders<TEntity>.Filter; } }
		private SortDefinitionBuilder<TEntity> SortBuilder { get { return Builders<TEntity>.Sort; } }

		public string CollectionName
		{
			get { return string.IsNullOrEmpty(_collectionName) ? typeof (TEntity).Name.ToLowerInvariant() : _collectionName; }
			set { _collectionName = value; }
		}

		public ActionResponse Add(TEntity item)
		{
			Collection.InsertOne(item);
			return new ActionResponse { Code = AppStatusCode.Ok };
		}

		public ActionResponse<IEnumerable<TEntity>> GetAll()
		{
			var allItems = Collection.Find(FilterBuilder.Empty);

			return new ActionResponse<IEnumerable<TEntity>>
			{
				Code = AppStatusCode.Ok,
				Data = allItems.ToList()
			};
		}

		public ActionResponse<TEntity> Get(string id)
		{
			var hits = Collection.Find(FilterBuilder.Eq("Id", id));

			return new ActionResponse<TEntity>
			{
				Code = AppStatusCode.Ok,
				Data = hits.FirstOrDefault()
			};
		}

		public ActionResponse<IEnumerable<TEntity>> Get(IEnumerable<string> ids)
		{
			var hits = Collection.Find(FilterBuilder.In("Id", ids));

			return new ActionResponse<IEnumerable<TEntity>>
			{
				Code = AppStatusCode.Ok,
				Data = hits.ToList()
			};
		}

		public ActionResponse<IEnumerable<TEntity>> Find<TValue>(string fieldName, TValue value, MatchingStrategy strategy, int limit = 100)
		{
			FilterDefinition<TEntity> filter;
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

			return new ActionResponse<IEnumerable<TEntity>>
			{
				Code = AppStatusCode.Ok,
				Data = hits.ToList()
			};
		}

		public ActionResponse<IEnumerable<TEntity>> Search(string query, int limit = 100)
		{
			var textFilter = FilterBuilder.Text(query, CultureInfo.CurrentCulture.TwoLetterISOLanguageName);

			var hits = Collection.Find(textFilter).Limit(limit);

			return new ActionResponse<IEnumerable<TEntity>>
			{
				Code = AppStatusCode.Ok,
				Data = hits.ToList()
			};
		}

		public ActionResponse Update(TEntity recipe)
		{
			var result = Collection.ReplaceOne(r => r.Id == recipe.Id, recipe);
			if (!result.IsAcknowledged)
			{
				return new ActionResponse
				{
					Code = AppStatusCode.UnknownError,
					Message = "Update failed. An unexpected error occured."
				};
			}

			return new ActionResponse { Code = AppStatusCode.Ok };
		}

		public ActionResponse Remove(string id)
		{
			var result = Collection.DeleteOne(FilterBuilder.Eq(r => r.Id, id));
			if (!result.IsAcknowledged)
			{
				return new ActionResponse
				{
					Code = AppStatusCode.UnknownError,
					Message = "Delete failed. An unexpected error occured."
				};
			}

			return new ActionResponse { Code = AppStatusCode.Ok };
		}
	}
}
