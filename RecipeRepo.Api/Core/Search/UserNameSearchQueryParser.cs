using System;

namespace RecipeRepo.Api.Core.Search
{
	public class UserNameSearchQueryParser : ISearchQueryParser
	{
		public Tuple<string, string> MapToFieldName(string rawQuery, string language)
		{
			return new Tuple<string,string>("Meta.Owner", rawQuery);
		}
	}
}