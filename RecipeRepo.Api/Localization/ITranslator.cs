namespace RecipeRepo.Api.Localization
{
	public interface ITranslator
	{
		string CurrentLanguage { get; set; }

		string Translate(string area, string key);
		string Translate(string area, string key, string langCode);
	}
}
