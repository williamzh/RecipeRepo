using System;

namespace RecipeRepo.Api.Core.Search
{
	public interface ISearchQueryParser
	{
		/// <summary>
		/// Parses the query and attempts to map the parsed value to a known field name.
		/// </summary>
		/// <param name="rawQuery">The raw search query.</param>
		/// <param name="language">The current language.</param>
		/// <returns>A tuple of the mapped field name and a custom search value, or null if no mapping was found.</returns>
		Tuple<string, string> MapToFieldName(string rawQuery, string language);
	}
}
