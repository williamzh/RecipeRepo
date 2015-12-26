using System;
using System.Collections.Generic;
using MongoDB.Driver;
using RecipeRepo.Common.Contract;
using RecipeRepo.Integrations.Db;
using RecipeRepo.Integrations.Entities;

namespace RecipeRepo.Integrations.Repositories
{
	public class UserRepository : IDbRepository<User>
	{
		private readonly IDbClient _dbClient;

		public UserRepository(IDbClient dbClient)
		{
			_dbClient = dbClient;
		}

		private IMongoCollection<User> Collection { get { return _dbClient.GetCollection<User>("users"); } }
		private FilterDefinitionBuilder<User> FilterBuilder { get { return Builders<User>.Filter; } }
		private SortDefinitionBuilder<User> SortBuilder { get { return Builders<User>.Sort; } }

		public ActionResponse Add(User user)
		{
			var filter = FilterBuilder.Eq("UserName", user.UserName);
			if (Collection.Find(filter).Any())
			{
				return new ActionResponse
				{
					Code = AppStatusCode.DuplicateExists,
					Message = "A user with the username " + user.UserName + " already exists."
				};
			}

			Collection.InsertOne(user);

			return new ActionResponse { Code = AppStatusCode.Ok };
		}

		public ActionResponse<User> Get(string id)
		{
			var hits = Collection.Find(FilterBuilder.Eq("Id", id));

			return new ActionResponse<User>
			{
				Code = AppStatusCode.Ok,
				Data = hits.FirstOrDefault()
			};
		}

		public ActionResponse<IEnumerable<User>> Get(IEnumerable<string> ids)
		{
			var hits = Collection.Find(FilterBuilder.In("Id", ids));

			return new ActionResponse<IEnumerable<User>>
			{
				Code = AppStatusCode.Ok,
				Data = hits.ToList()
			};
		}

		public ActionResponse<IEnumerable<User>> Find<TValue>(string fieldName, TValue value, MatchingStrategy strategy, int limit = 100)
		{
			if (fieldName != "UserName" && fieldName != "Email")
			{
				return new ActionResponse<IEnumerable<User>>
				{
					Code = AppStatusCode.Unsupported,
					Message = "Due to security reasons, users can only be queried on username and email."
				};
			}

			if (strategy != MatchingStrategy.Equals)
			{
				return new ActionResponse<IEnumerable<User>>
				{
					Code = AppStatusCode.Unsupported,
					Message = "Only the Equals strategy can be used."
				};
			}

			var filter = FilterBuilder.Eq(fieldName, value);
			var hits = Collection
				.Find(filter)
				.Sort(SortBuilder.Descending(fieldName))
				.Limit(limit);

			return new ActionResponse<IEnumerable<User>>
			{
				Code = AppStatusCode.Ok,
				Data = hits.ToList()
			};
		}

		public ActionResponse Update(User user)
		{
			var existingUser = Collection.Find(FilterBuilder.Eq(u => u.Id, user.Id)).FirstOrDefault();
			if (existingUser == null)
			{
				return new ActionResponse
				{
					Code = AppStatusCode.EntityNotFound,
					Message = "Update failed. Could not find a user with a matching ID (" + user.Id + ")."
				};
			}

			if (existingUser.UserName != user.UserName)
			{
				return new ActionResponse
				{
					Code = AppStatusCode.Unsupported,
					Message = "Update failed. The username cannot be changed once set."
				};
			}

			var result = Collection.ReplaceOne(r => r.Id == user.Id, user);
			if (!result.IsAcknowledged || result.ModifiedCount == 0)
			{
				return new ActionResponse
				{
					Code = AppStatusCode.UnknownError,
					Message = "Update failed. An unexpected error occured."
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
					Message = "Delete failed. Could not find a user with a matching ID (" + id + ")."
				};
			}

			return new ActionResponse
			{
				Code = AppStatusCode.Ok
			};
		}

		public ActionResponse<IEnumerable<User>> Search(string query, int limit = 100)
		{
			throw new NotImplementedException();
		}
	}
}
