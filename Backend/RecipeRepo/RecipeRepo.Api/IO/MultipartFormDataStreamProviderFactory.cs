namespace RecipeRepo.Api.IO
{
	public class MultipartFormDataStreamProviderFactory
	{
		public CustomMultipartFormDataStreamProvider CreateCustomMultipartFormDataStreamProvider(string root)
		{
			return new CustomMultipartFormDataStreamProvider(root);
		}
	}
}