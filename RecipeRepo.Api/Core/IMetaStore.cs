using System.Collections.Generic;
using RecipeRepo.Common.Contract;
using RecipeRepo.Integrations.Entities;

namespace RecipeRepo.Api.Core
{
	public interface IMetaStore
	{
		ActionResponse AddMeta(Meta meta);
		ActionResponse<IEnumerable<Meta>> GetAllMeta();
		ActionResponse<Meta> GetMetaByName(string name);
		ActionResponse UpdateMeta(Meta meta);
		ActionResponse DeleteMeta(string id);
	}
}
