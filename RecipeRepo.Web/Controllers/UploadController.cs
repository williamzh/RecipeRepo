using System.IO;
using System.Net;
using System.Web.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using RecipeRepo.Common.Configuration;

namespace RecipeRepo.Web.Controllers
{
    public class UploadController : Controller
    {
	    private readonly ConfigurationManager _configManager;

	    public UploadController(ConfigurationManager configManager)
	    {
		    _configManager = configManager;
	    }

	    [HttpPost]
		public ActionResult Image()
		{
			if (Request.Files.Count > 0)
			{
				var file = Request.Files[0];

				if (file != null && file.ContentLength > 0)
				{
					var fileName = Path.GetFileName(file.FileName);
					var uploadLocation = _configManager.GetAppSetting("ImageUploadLocation") + fileName;
					
					file.SaveAs(Server.MapPath(uploadLocation));

					return Json(new
					{
						Path = uploadLocation
					});
				}
			}

		    return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
		}

		protected new virtual ActionResult Json(object obj)
		{
			return Content(JsonConvert.SerializeObject(obj, new JsonSerializerSettings
			{
				ContractResolver = new CamelCasePropertyNamesContractResolver()
			}), "application/json");
		}
    }
}
