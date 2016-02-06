using System;
using Newtonsoft.Json.Linq;
using RecipeRepo.Api.IO;

namespace RecipeRepo.Api.Localization
{
	public class JsonTranslator : ITranslator
	{
		private readonly JsonFileReader _jsonReader;

		public JsonTranslator(JsonFileReader jsonReader)
		{
			_jsonReader = jsonReader;
		}

		public string CurrentLanguage { get; set; }

		public string Translate(string area, string key)
		{
			if (CurrentLanguage == null)
			{
				throw new InvalidOperationException("A language must be set before translating.");
			}

			return Translate(area, key, CurrentLanguage);
		}

		public string Translate(string area, string key, string langCode)
		{
			var translations = _jsonReader.GetFileContents<JObject>("~/Localization/lang_" + (langCode ?? "sv-SE") + ".json");

			var areaObj = translations[area];
			if (areaObj != null)
			{
				var translation = areaObj[key];
				if (translation != null)
				{
					return translation.Value<string>();
				}
			}

			return string.Format("[{0}/{1}]", area, key);
		}
	}
}