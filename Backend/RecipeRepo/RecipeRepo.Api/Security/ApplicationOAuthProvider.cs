using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Owin.Security.OAuth;
using RecipeRepo.Common.Contract;

namespace RecipeRepo.Api.Security
{
	public class ApplicationOAuthProvider : OAuthAuthorizationServerProvider
	{
		private readonly IAuthService _authService;

		public ApplicationOAuthProvider(IAuthService authService)
		{
			_authService = authService;
		}

		public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
		{
			if (string.IsNullOrEmpty(context.UserName) || string.IsNullOrEmpty(context.Password))
			{
				context.SetError("invalid_grant", "User name and/or password must be supplied.");
				return;
			}

			var authResponse = _authService.Authenticate(context.UserName, context.Password);

			if (authResponse.Code == AppStatusCode.InvalidCredentials)
			{
				context.SetError("invalid_grant", "The user name or password is incorrect.");
				return;
			}
			if (authResponse.Code != AppStatusCode.Ok)
			{
				context.SetError("unexpected_error", "An unexpected error occured during authentication.");
				return;
			}

			var identity = new ClaimsIdentity(context.Options.AuthenticationType);
			identity.AddClaims(new []
			{
				new Claim("userId", authResponse.Data.Id),
				new Claim("userName", context.UserName),
				new Claim("lang", authResponse.Data.Settings.Language)
			});

			context.Validated(identity);
		}

		public override Task TokenEndpoint(OAuthTokenEndpointContext context)
		{
			var claims = context.Identity.Claims;
			foreach (var claim in claims)
			{
				context.AdditionalResponseParameters.Add(claim.Type, claim.Value);
			}

			return Task.FromResult<object>(null);
		}

		public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
		{
			// Resource owner password credentials does not provide a client ID.
			if (context.ClientId == null)
			{
				context.Validated();
			}

			return Task.FromResult<object>(null);
		}
	}
}