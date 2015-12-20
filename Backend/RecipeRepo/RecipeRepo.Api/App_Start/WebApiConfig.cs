﻿using System.Web.Http;
using Newtonsoft.Json.Serialization;

namespace RecipeRepo.Api
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

			//var cors = new EnableCorsAttribute(ConfigurationManager.AppSettings["AllowedCorsUrl"], "*", "*");
			//config.EnableCors(cors);
			
			// Serialize JSON with camel case
			config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
        }
    }
}
