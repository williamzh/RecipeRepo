﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MainApp.Controllers
{
    public class RecipeController : Controller
    {
        //
        // GET: /Recipe/

        public ActionResult Index()
        {
            return View();
        }

    }
}
