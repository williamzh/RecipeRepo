﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace RecipeRepo.Api
{
	public static class WebApiConfig
	{
		public static void Register(HttpConfiguration config)
		{
			config.EnableCors();

			config.Routes.MapHttpRoute(
				name: "DefaultApi",
				routeTemplate: "api/{controller}/{id}",
				defaults: new { controller = "Home", id = RouteParameter.Optional }
			);
		}
	}
}