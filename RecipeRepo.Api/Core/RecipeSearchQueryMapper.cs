using System;
using System.Linq;
using RecipeRepo.Api.IO;
using RecipeRepo.Common.Contract;
using RecipeRepo.Integrations.Entities;
using RecipeRepo.Integrations.Repositories;

namespace RecipeRepo.Api.Core
{
	public class RecipeSearchQueryMapper
	{
		private readonly IDbRepository<Meta> _metaRepository;
		private readonly JsonFileReader _jsonReader;

		public RecipeSearchQueryMapper(IDbRepository<Meta> metaRepository, JsonFileReader jsonReader)
		{
			_metaRepository = metaRepository;
			_jsonReader = jsonReader;
		}

		public virtual string MapToMetaKey(string query, string userLang)
		{
			var metaResponse = _metaRepository.GetAll();
			if (metaResponse.Code != AppStatusCode.Ok)
			{
				return null;
			}

			var metaKeys = metaResponse.Data.SelectMany(m => m.Values);
			var metaTranslations = _jsonReader.GetFileContents<dynamic>("~/Localization/lang_" + userLang + ".json")["meta"];

			return metaKeys.FirstOrDefault(k => ((string)metaTranslations[k]).Equals(query, StringComparison.InvariantCultureIgnoreCase));
		}
	}
}