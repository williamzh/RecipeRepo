using System;
using System.Linq;
using RecipeRepo.Api.IO;
using RecipeRepo.Common.Contract;
using RecipeRepo.Integrations.Entities;
using RecipeRepo.Integrations.Repositories;

namespace RecipeRepo.Api.Core.Search
{
	public class MetaSearchQueryParser : ISearchQueryParser
	{
		private readonly IDbRepository<Meta> _metaRepository;
		private readonly JsonFileReader _jsonReader;

		public MetaSearchQueryParser(IDbRepository<Meta> metaRepository, JsonFileReader jsonReader)
		{
			_metaRepository = metaRepository;
			_jsonReader = jsonReader;
		}

		public Tuple<string, string> MapToFieldName(string rawQuery, string language)
		{
			var metaResponse = _metaRepository.GetAll();
			if (metaResponse.Code != AppStatusCode.Ok)
			{
				return null;
			}

			var metaKeys = metaResponse.Data.SelectMany(m => m.Values);
			var metaTranslations = _jsonReader.GetFileContents<dynamic>("~/Localization/lang_" + language + ".json")["meta"];

			var mappedQuery = metaKeys.FirstOrDefault(k => ((string)metaTranslations[k]).Equals(rawQuery, StringComparison.InvariantCultureIgnoreCase));
			if (mappedQuery == null)
			{
				return null;
			}

			var metaType = mappedQuery.Substring(0, 3);
			var metaSubField = metaType == "cat" ? "Category" :
				metaType == "cui" ? "Cuisine" : "Course";

			return new Tuple<string, string>("Meta." + metaSubField, mappedQuery);
		}
	}
}