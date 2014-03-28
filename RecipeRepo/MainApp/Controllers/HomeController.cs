using BusinessLogic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MainApp.Controllers
{
    public class HomeController : Controller
    {
		private readonly IRecipeRepository _recipeRepository;

		public HomeController(IRecipeRepository recipeRepository)
		{
			_recipeRepository = recipeRepository;
		}

        //
        // GET: /Home/

        public ActionResult Index()
        {
			var featuredRecipes = _recipeRepository.GetRecipes().Where(r => r.Rating >= 4);

            return View(featuredRecipes);
        }

    }
}
