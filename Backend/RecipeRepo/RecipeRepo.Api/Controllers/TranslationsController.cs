using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using RecipeRepo.Api.IO;
using RecipeRepo.Common.Contract;

namespace RecipeRepo.Api.Controllers
{
    public class TranslationsController : BaseApiController
    {
	    private readonly JsonFileReader _jsonReader;
	    private readonly IFileManager _fileManager;

	    public TranslationsController(JsonFileReader jsonReader, IFileManager fileManager)
	    {
		    _jsonReader = jsonReader;
		    _fileManager = fileManager;
	    }

	    [Route("api/translations/{langCode:regex(^[A-Za-z]{2}-[A-Za-z]{2}$)}")]
	    public IHttpActionResult GetAll(string langCode)
	    {
		    if (string.IsNullOrEmpty(langCode))
		    {
				return BadRequest(AppStatusCode.InvalidInput, "Language code must be provided.");
		    }

		    var translations = _jsonReader.GetFileContents<dynamic>("~/Localization/lang_" + langCode + ".json");

		    var response = new ActionResponse<dynamic>
		    {
				Code = AppStatusCode.Ok,
				Data = translations
		    };
			
		    return Ok(response);
	    }

		[Route("api/translations/languages")]
	    public IHttpActionResult GetLanguages()
		{
			var translationFiles = _fileManager.GetFilesInDirectory("~/Localization", false).Where(f => f.StartsWith("lang_"));
			var langs = translationFiles.Select(f => f.Substring("lang_".Length, 5));

			var response = new ActionResponse<IEnumerable<string>>
			{
				Code = AppStatusCode.Ok,
				Data = langs
			};

			return Ok(response);
		}
    }
}
