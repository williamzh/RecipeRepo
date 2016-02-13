using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using RecipeRepo.Integrations.Email;

namespace RecipeRepo.Integrations.Tests.Email
{
	[TestClass]
	public class SmtpMailClientTest
	{
		[TestMethod]
		public void SendMail_ShouldBeAbleToSendMail()
		{
			// Arrange
			var client = new SmtpMailClient();

			// Act
			var isOk = client.SendMail("williamzh87@gmail.com", "", "test@gmail.com", "Testing", "This is a test");

			// Assert
			Assert.IsTrue(isOk);
		}
	}
}
