using System.Linq;
using RecipeRepo.Common.Contract;
using RecipeRepo.Integrations.Entities;
using RecipeRepo.Integrations.Repositories;

namespace RecipeRepo.Api.Core
{
	public class DictionaryStore<TData> : IDictionaryStore<TData>
	{
		private readonly IDbRepository<DictionaryItem<TData>> _dictionaryRepo;

		public DictionaryStore(IDbRepository<DictionaryItem<TData>> dictionaryRepo)
		{
			_dictionaryRepo = dictionaryRepo;
		}

		public ActionResponse Add(DictionaryItem<TData> item)
		{
			var itemResponse = _dictionaryRepo.Find("Key", item.Key, MatchingStrategy.Equals);
			if (itemResponse.Code != AppStatusCode.Ok)
			{
				return new ActionResponse
				{
					Code = itemResponse.Code,
					Message = "Could not add item - existance check failed. Underlying error: " + itemResponse.Message
				};
			}

			if (itemResponse.Data != null && itemResponse.Data.Any())
			{
				return new ActionResponse
				{
					Code = AppStatusCode.DuplicateExists,
					Message = "An item with the key " + item.Key + " already exists."
				};
			}

			return _dictionaryRepo.Add(item);
		}

		public ActionResponse<DictionaryItem<TData>> Get(string key)
		{
			var itemResponse = _dictionaryRepo.Find("Key", key, MatchingStrategy.Equals);
			if (itemResponse.Code != AppStatusCode.Ok)
			{
				return new ActionResponse<DictionaryItem<TData>>
				{
					Code = itemResponse.Code,
					Message = "Could not add item - existance check failed. Underlying error: " + itemResponse.Message
				};
			}

			return new ActionResponse<DictionaryItem<TData>>
			{
				Code = AppStatusCode.Ok,
				Data = itemResponse.Data.FirstOrDefault()
			};
		}

		public ActionResponse Remove(string key)
		{
			var itemResponse = _dictionaryRepo.Find("Key", key, MatchingStrategy.Equals);
			if (itemResponse.Code != AppStatusCode.Ok)
			{
				return new ActionResponse<DictionaryItem<TData>>
				{
					Code = itemResponse.Code,
					Message = "Could not add item - existance check failed. Underlying error: " + itemResponse.Message
				};
			}

			var item = itemResponse.Data.FirstOrDefault();
			if (item == null)
			{
				return new ActionResponse
				{
					Code = AppStatusCode.EntityNotFound,
					Message = "Delete failed. Could not find an item with a matching ID (" + key + ")."
				};
			}

			return _dictionaryRepo.Remove(item.Id);
		}
	}
}