using System.Web.Http;
using RecipeRepo.Api.IO;
using RecipeRepo.Common.Contract;

namespace RecipeRepo.Api.Controllers
{
    public class TranslationsController : BaseApiController
    {
	    private readonly JsonFileReader _jsonReader;

	    public TranslationsController(JsonFileReader jsonReader)
	    {
		    _jsonReader = jsonReader;
	    }

		[Route("api/translations/{langCode}")]
	    public IHttpActionResult GetAll(string langCode)
	    {
		    if (string.IsNullOrEmpty(langCode))
		    {
				return BadRequest(AppStatusCode.InvalidInput, "Language code must be provided.");
		    }

		    var translations = _jsonReader.GetFileContents("~/Localization/lang_" + langCode.ToLower() + ".json");

		    var response = new ActionResponse<dynamic>
		    {
				Code = AppStatusCode.Ok,
				Data = translations
		    };
			
		    return Ok(response);
	    }
    }
}
