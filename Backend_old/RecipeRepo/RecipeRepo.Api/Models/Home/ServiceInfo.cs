using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RecipeRepo.Api.Models.Home
{
	public class ServiceInfo
	{
		public string Description { get; set; }
		public string Endpoint { get; set; }
		public IEnumerable<string> Actions { get; set; }
	}
}