using System.Net;
using System.Net.Http;
using System.Web.Http;
using log4net;

namespace RecipeRepo.Api.Controllers
{
    public abstract class BaseApiController : ApiController
    {
		protected BaseApiController()
        {
            Log = LogManager.GetLogger(GetType());
        }

		protected ILog Log { get; private set; }

		protected IHttpActionResult InternalServerError(string message)
		{
			var responseMsg = Request.CreateErrorResponse(HttpStatusCode.InternalServerError, message);
			return ResponseMessage(responseMsg);
		}

		protected IHttpActionResult NotFound(string message)
		{
			var responseMsg = Request.CreateErrorResponse(HttpStatusCode.NotFound, message);
			return ResponseMessage(responseMsg);
		}
    }
}
