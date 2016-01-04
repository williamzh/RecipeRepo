using System.Web.Http;
using RecipeRepo.Api.Core;
using RecipeRepo.Api.Filters;
using RecipeRepo.Common.Contract;
using RecipeRepo.Integrations.Entities;

namespace RecipeRepo.Api.Controllers
{
	[ClaimsAuthorize("admin")]
    public class MetaController : BaseApiController
    {
	    private readonly IMetaStore _metaStore;

	    public MetaController(IMetaStore metaStore)
	    {
		    _metaStore = metaStore;
	    }

	    public IHttpActionResult Get()
	    {
			var response = _metaStore.GetAllMeta();
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("GET /meta failed with code {0}. {1}", (int)response.Code, response.Message);
				return InternalServerError(response.Code, response.Message);
			}

			return Ok(response);
	    }

		[Route("api/meta/{name}")]
		public IHttpActionResult Get(string name)
		{
			if (string.IsNullOrEmpty(name))
			{
				return BadRequest(AppStatusCode.InvalidInput, "Meta object name must be provided.");
			}

			var response = _metaStore.GetMetaByName(name);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("GET /meta/{0} failed with code {1}. {2}", name, (int)response.Code, response.Message);
				return InternalServerError(response.Code, response.Message);
			}

			return Ok(response);
		}

		public IHttpActionResult Post(Meta meta)
		{
			if (meta == null)
			{
				return BadRequest(AppStatusCode.InvalidInput, "Meta object must be provided.");
			}

			var response = _metaStore.AddMeta(meta);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("POST /meta failed with code {0}. Could not add meta object. {1}", (int)response.Code, response.Message);
				return InternalServerError(response.Code, response.Message);
			}

			return Ok(response);
		}

		public IHttpActionResult Put(Meta meta)
		{
			if (meta == null || string.IsNullOrEmpty(meta.Id))
			{
				return BadRequest(AppStatusCode.InvalidInput, "Meta object with a valid ID must be provided.");
			}

			var response = _metaStore.UpdateMeta(meta);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("PUT /meta failed with code {0}. {1}", (int)response.Code, response.Message);
				return InternalServerError(response.Code, response.Message);
			}

			return Ok(response);
		}

		public IHttpActionResult Delete(string id)
		{
			if (string.IsNullOrEmpty(id))
			{
				return BadRequest(AppStatusCode.InvalidInput, "Recipe ID must be provided.");
			}

			var response = _metaStore.DeleteMeta(id);
			if (response.Code != AppStatusCode.Ok)
			{
				Log.ErrorFormat("DELETE /meta/{0} failed with code {1}. {2}", id, (int)response.Code, response.Message);
				return InternalServerError(response.Code, response.Message);
			}

			return Ok(response);
		}
    }
}
