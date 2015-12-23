using System;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web.Http.Filters;
using log4net;
using RecipeRepo.Api.Controllers;
using RecipeRepo.Common.Contract;

namespace RecipeRepo.Api.Filters
{
	[AttributeUsage(AttributeTargets.Class, AllowMultiple = false, Inherited = true)]
	public class GenericExceptionFilterAttribute : ExceptionFilterAttribute
	{
		private readonly ILog _log;

		public GenericExceptionFilterAttribute()
		{
			_log = LogManager.GetLogger(GetType());
		}

		public override void OnException(HttpActionExecutedContext context)
		{
			_log.Error("An unhandled exception occurred.", context.Exception);

			var baseController = context.ActionContext.ControllerContext.Controller as BaseApiController;
			if (baseController == null)
			{
				// Shouldn't normally be possible since all controllers should derive from BaseApiController
				context.Response = context.Request.CreateErrorResponse(HttpStatusCode.InternalServerError, context.Exception.Message);
				return;
			}

			context.Response = baseController.InternalServerError(AppStatusCode.UnknownError, context.Exception.Message).ExecuteAsync(CancellationToken.None).Result;
		}
	}
}