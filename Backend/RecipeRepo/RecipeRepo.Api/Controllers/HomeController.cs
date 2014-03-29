using RecipeRepo.Api.Models.Home;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace RecipeRepo.Api.Controllers
{
	public class HomeController : ApiController
	{
		// GET api/<controller>
		public dynamic Get()
		{
			return new
			{
				Name = "RecipeRepo.Api",
				Version = "0.0.1",
				Services = new []
				{
					new ServiceInfo { Description = "Recipes", Endpoint = "/recipes" },
					new ServiceInfo { Description = "Administrative actions/info", Endpoint = "/admin" }
				}
			};
		}
	}
}