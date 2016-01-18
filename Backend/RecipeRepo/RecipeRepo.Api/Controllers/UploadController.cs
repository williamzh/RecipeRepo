using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using RecipeRepo.Api.Environment;
using RecipeRepo.Api.IO;
using RecipeRepo.Common.Contract;

namespace RecipeRepo.Api.Controllers
{
    public class UploadController : BaseApiController
    {
	    private readonly MultipartFormDataStreamProviderFactory _multipartProviderFactory;
	    private readonly EnvironmentInfo _envInfo;

		public UploadController(MultipartFormDataStreamProviderFactory multipartProviderFactory, EnvironmentInfo envInfo)
	    {
		    _multipartProviderFactory = multipartProviderFactory;
			_envInfo = envInfo;
	    }

	    public async Task<IHttpActionResult> Image()
		{
			if (!Request.Content.IsMimeMultipartContent())
			{
				return BadRequest(AppStatusCode.InvalidInput, "Request must contain multipart/form-data.");
			}

		    var uploadLocation = ConfigManager.GetAppSetting("UploadImageLocation");
		    if (string.IsNullOrEmpty(uploadLocation))
		    {
			    Log.Error("Image upload failed because upload location has not been provided in app settings.");
			    return InternalServerError(AppStatusCode.UnknownError, "Image upload failed.");
		    }

			var provider = _multipartProviderFactory.CreateCustomMultipartFormDataStreamProvider(uploadLocation);
			await Request.Content.ReadAsMultipartAsync(provider);

		    var response = new ActionResponse<IEnumerable<string>>
		    {
			    Code = AppStatusCode.Ok,
			    Data = provider.FileData.Select(f =>
			    {
				    var fileName = f.LocalFileName.Substring(f.LocalFileName.LastIndexOf('\\') + 1);
				    return _envInfo.MapToUrl(uploadLocation + "/" + fileName);
			    })
		    };

			return Ok(response);
		}
    }
}
