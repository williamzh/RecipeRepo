using System.Security.Claims;
using System.Web.Http;
using System.Web.Http.Controllers;
using log4net;

namespace RecipeRepo.Api.Filters
{
	public class ClaimsAuthorizeAttribute : AuthorizeAttribute
	{
		private readonly ILog _log;
		private readonly string _privilege;

		public ClaimsAuthorizeAttribute(string privilege)
		{
			_log = LogManager.GetLogger(typeof(ClaimsAuthorizeAttribute));
			_privilege = privilege;
		}

		protected override bool IsAuthorized(HttpActionContext actionContext)
		{
			var claimsIdentity = actionContext.RequestContext.Principal as ClaimsPrincipal;
			if (claimsIdentity == null)
			{
				_log.Warn("Principal was not a ClaimsPrincipal. Skipping claims authorization.");
				return false;
			}

			var roleClaim = claimsIdentity.FindFirst("privilege");
			if (roleClaim == null || _privilege != roleClaim.Value)
			{
				_log.Debug("Unauthorized. User does not have any privileges, or does not have the required privilege (" + _privilege + ").");
				return false;
			}

			return base.IsAuthorized(actionContext);
		} 
	}
}