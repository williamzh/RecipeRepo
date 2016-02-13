using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using RecipeRepo.Api.Core;
using RecipeRepo.Common.Contract;

namespace RecipeRepo.Api.Controllers
{
	[AllowAnonymous]
    public class ResetController : BaseApiController
    {
		private readonly IUserManager _userManager;
		private readonly IDictionaryStore<string> _dictionaryStore;

		public ResetController(IUserManager userManager, IDictionaryStore<string> dictionaryStore)
		{
			_userManager = userManager;
			_dictionaryStore = dictionaryStore;
		}

		[HttpPost]
		[Route("api/reset/verify/user")]
	    public IHttpActionResult VerifyUserName([FromBody] string userName)
		{
			var response = _userManager.GetUserByUserName(userName);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("POST /reset/verify/user for {0} failed with code {1}. {2}", userName, (int)response.Code, response.Message);
				return InternalServerError(AppStatusCode.UnknownError, "Invalid data.");
			}

			if (response.Data == null)
			{
				Log.ErrorFormat("POST /reset/verify/user for {0} failed. User does not exist.", userName);
				return InternalServerError(AppStatusCode.UnknownError, "Invalid data.");
			}

			var token = Guid.NewGuid().ToString();

			// TODO: associate and store token in temp storage

			return Ok(new ActionResponse<string>
			{
				Code = AppStatusCode.Ok,
				Data = token
			});
		}

		[HttpPost]
		[Route("api/reset/verify/phone")]
		public IHttpActionResult VerifyPhone([FromBody] string phoneNo)
		{
			
			// TODO: move into filter
			var tokenHeader = Request.Headers.GetValues("guidToken").FirstOrDefault(h => h == "token");
			if (tokenHeader == null)
			{
				Log.ErrorFormat("POST /reset/verify/phone for {0} failed. No GUID token found in header.", phoneNo);
				return InternalServerError(AppStatusCode.UnknownError, "Invalid data.");
			}

			var userName = "wizha";		// TODO: retrieve username from temp storage based on GUID token

			var response = _userManager.GetUserByUserName(userName);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("POST /reset/verify/phone for {0} failed with code {1}. {2}", userName, (int)response.Code, response.Message);
				return InternalServerError(AppStatusCode.UnknownError, "Invalid data.");
			}

			var user = response.Data;
			if (user == null)
			{
				Log.ErrorFormat("POST /reset/verify/phone for {0} failed. User does not exist.", userName);
				return InternalServerError(AppStatusCode.UnknownError, "Invalid data.");
			}
			
			if (user.PhoneNumber != phoneNo)
			{
				Log.ErrorFormat("POST /reset/verify/phone for {0} failed. Provided phone number {1} does not match {2}.", userName, phoneNo, user.PhoneNumber);
				return InternalServerError(AppStatusCode.UnknownError, "Invalid data.");
			}

			return Ok(new ActionResponse { Code = AppStatusCode.Ok });
		}

		[HttpPost]
		[Route("api/reset/update")]
		public IHttpActionResult UpdatePassword([FromBody] string phoneNo)
		{
			// TODO: move into filter
			var tokenHeader = Request.Headers.GetValues("guidToken").FirstOrDefault(h => h == "token");
			if (tokenHeader == null)
			{
				Log.ErrorFormat("POST /reset/verify/phone failed. No GUID token found in header.");
				return InternalServerError(AppStatusCode.UnknownError, "Invalid data.");
			}

			// TODO: update password

			// TODO: delete GUID token from temp storage

			return Ok(new ActionResponse { Code = AppStatusCode.Ok });
		}
    }
}
