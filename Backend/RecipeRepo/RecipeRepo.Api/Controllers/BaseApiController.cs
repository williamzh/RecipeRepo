using System.Net;
using System.Web.Http;
using System.Web.Http.Results;
using log4net;
using RecipeRepo.Api.Filters;
using RecipeRepo.Api.Security;
using RecipeRepo.Common.Configuration;
using RecipeRepo.Common.Contract;

namespace RecipeRepo.Api.Controllers
{
	[GenericExceptionFilter]
    public abstract class BaseApiController : ApiController
    {
		protected BaseApiController()
        {
            Log = LogManager.GetLogger(GetType());
        }

		protected ILog Log { get; private set; }

		public IClaimContext ClaimContext { get; set; }
		public ConfigurationManager ConfigManager { get; set; }

		public IHttpActionResult InternalServerError(AppStatusCode code, string message)
		{
			return new NegotiatedContentResult<ActionResponse>(HttpStatusCode.InternalServerError, new ActionResponse
			{
				Code = code,
				Message = message
			}, this);
		}

		public IHttpActionResult BadRequest(AppStatusCode code, string message)
		{
			return new NegotiatedContentResult<ActionResponse>(HttpStatusCode.BadRequest, new ActionResponse
			{
				Code = code,
				Message = message
			}, this);
		}

		public IHttpActionResult NotFound(AppStatusCode code, string message)
		{
			return new NegotiatedContentResult<ActionResponse>(HttpStatusCode.NotFound, new ActionResponse
			{
				Code = code,
				Message = message
			}, this);
		}
    }
}
