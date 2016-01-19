using System.Linq;
using log4net;
using RecipeRepo.Common.Contract;
using RecipeRepo.Integrations.Entities;
using RecipeRepo.Integrations.Repositories;

namespace RecipeRepo.Api.Security
{
	public class AuthService : IAuthService
	{
		private readonly IDbRepository<User> _userRepo;
		private readonly ILog _log;

		public AuthService(IDbRepository<User> userRepo)
		{
			_userRepo = userRepo;
			_log = LogManager.GetLogger(typeof (AuthService));
		}

		public ActionResponse<User> Authenticate(string userName, string password)
		{
			var response = _userRepo.Find("UserName", userName, MatchingStrategy.Equals);
			if (response.Code != AppStatusCode.Ok)
			{
				_log.Error("Failed to retrieve user during authentication. " + response.Message);
				return new ActionResponse<User>
				{
					Code = response.Code,
					Message = response.Message
				};
			}

			var user = response.Data.FirstOrDefault();

			if (user == null || user.Password != password)
			{
				_log.Warn("User authentication failed for user {0}. Username or password was incorrect.");
				return new ActionResponse<User>
				{
					Code = AppStatusCode.InvalidCredentials,
					Message = "Username or password was incorrect."
				};
			}

			return new ActionResponse<User>
			{
				Code = AppStatusCode.Ok,
				Data = user
			};
		}

		public ActionResponse<bool> IsAdmin(string userName)
		{
			return new ActionResponse<bool>
			{
				Code = AppStatusCode.Ok,
				Data = userName == "wizha"	// TODO: fetch from some sort of store
			};
		}
	}
}