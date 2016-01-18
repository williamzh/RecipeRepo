using System.Net.Http;
using System.Net.Http.Headers;

namespace RecipeRepo.Api.IO
{
	public class CustomMultipartFormDataStreamProvider : MultipartFormDataStreamProvider
	{
		public CustomMultipartFormDataStreamProvider(string rootPath) : base(rootPath) { }

		public override string GetLocalFileName(HttpContentHeaders headers)
		{
			if (!string.IsNullOrWhiteSpace(headers.ContentDisposition.FileName))
			{
				// Replace extra quotes since Chrome submits files in quotation marks which get treated as part of the filename and get escaped	
				return headers.ContentDisposition.FileName.Replace("\"", string.Empty);
			}
			
			return base.GetLocalFileName(headers);
		}
	}
}