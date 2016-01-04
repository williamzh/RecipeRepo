using System.Collections.Generic;
using System.Linq;
using RecipeRepo.Common.Contract;
using RecipeRepo.Integrations.Entities;
using RecipeRepo.Integrations.Repositories;

namespace RecipeRepo.Api.Core
{
	public class MetaStore : IMetaStore
	{
		private readonly IDbRepository<Meta> _dbRepository;

		public MetaStore(IDbRepository<Meta> dbRepository)
		{
			_dbRepository = dbRepository;
		}

		public ActionResponse AddMeta(Meta meta)
		{
			var findResponse = _dbRepository.Find("Name", meta.Name, MatchingStrategy.Equals);
			if (findResponse.Code != AppStatusCode.Ok)
			{
				return new ActionResponse
				{
					Code = findResponse.Code,
					Message = "Could not create meta - existance check failed. Underlying error: " + findResponse.Message
				};
			}

			if (findResponse.Data != null && findResponse.Data.Any())
			{
				return new ActionResponse
				{
					Code = AppStatusCode.DuplicateExists,
					Message = "Meta with the name " + meta.Name + " already exists."
				};
			}

			return _dbRepository.Add(meta);
		}

		public ActionResponse<IEnumerable<Meta>> GetAllMeta()
		{
			return _dbRepository.GetAll();
		}

		public ActionResponse<Meta> GetMetaByName(string name)
		{
			var response = _dbRepository.Find("Name", name, MatchingStrategy.Equals);
			if (response.Code != AppStatusCode.Ok)
			{
				return new ActionResponse<Meta>
				{
					Code = response.Code,
					Message = response.Message
				};
			}

			return new ActionResponse<Meta>
			{
				Code = AppStatusCode.Ok,
				Data = response.Data.FirstOrDefault()
			};
		}

		public ActionResponse UpdateMeta(Meta meta)
		{
			var getResponse = _dbRepository.Get(meta.Id);
			if (getResponse.Code != AppStatusCode.Ok)
			{
				return new ActionResponse
				{
					Code = getResponse.Code,
					Message = "Could not update meta - existance check failed. Underlying error: " + getResponse.Message
				};
			}

			if (getResponse.Data == null)
			{
				return new ActionResponse
				{
					Code = AppStatusCode.EntityNotFound,
					Message = "Update failed. Could not find meta with a matching ID (" + meta.Id + ")."
				};
			}

			return _dbRepository.Update(meta);
		}

		public ActionResponse DeleteMeta(string id)
		{
			var getResponse = _dbRepository.Get(id);
			if (getResponse.Code != AppStatusCode.Ok)
			{
				return new ActionResponse
				{
					Code = getResponse.Code,
					Message = "Could not delete meta - existance check failed. Underlying error: " + getResponse.Message
				};
			}

			if (getResponse.Data == null)
			{
				return new ActionResponse
				{
					Code = AppStatusCode.EntityNotFound,
					Message = "Delete failed. Could not find meta with a matching ID (" + id + ")."
				};
			}

			return _dbRepository.Remove(id);
		}
	}
}