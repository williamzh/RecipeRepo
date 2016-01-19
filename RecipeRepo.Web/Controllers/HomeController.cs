using System.Web.Mvc;

namespace RecipeRepo.Web.Controllers
{
	public class HomeController : Controller
	{
		public ActionResult Index()
		{
			return View();
		}
	}
}