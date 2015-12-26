using System.Security.Claims;
using System.Web;

namespace RecipeRepo.Api.Security
{
	public class ClaimContext : IClaimContext
	{
		private ClaimsPrincipal _currentUser;

		public string UserId { get { return GetClaimValue("userId"); } }
		public string UserName { get { return GetClaimValue("userName"); } }

		private ClaimsPrincipal CurrentUser
		{
			get
			{
				if (_currentUser != null)
				{
					return _currentUser;
				}

				_currentUser = HttpContext.Current.GetOwinContext().Authentication.User;
				if (_currentUser == null || !_currentUser.Identity.IsAuthenticated)
				{
					return null;
				}

				return _currentUser;
			}
		}

		private string GetClaimValue(string claimType)
		{
			if (CurrentUser == null)
			{
				return null;
			}

			var claim = CurrentUser.FindFirst(claimType);
			return claim == null ? null : claim.Value;
		}
	}
}