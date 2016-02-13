using RecipeRepo.Common.Contract;
using RecipeRepo.Integrations.Entities;

namespace RecipeRepo.Api.Core
{
	public interface IDictionaryStore<TData>
	{
		ActionResponse Add(DictionaryItem<TData> item);
		ActionResponse<DictionaryItem<TData>> Get(string key);
		ActionResponse Remove(string key);
	}
}
