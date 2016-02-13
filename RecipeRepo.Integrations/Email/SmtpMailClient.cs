using System;
using System.Net.Mail;
using log4net;

namespace RecipeRepo.Integrations.Email
{
	public class SmtpMailClient : IMailClient
	{
		private readonly ILog _log;

		public SmtpMailClient()
		{
			_log = LogManager.GetLogger(typeof (SmtpMailClient));
		}

		public bool SendMail(string recipient, string cc, string sender, string subject, string message)
		{
			using (var smtpClient = new SmtpClient())
			{
				//smtpClient.Credentials = new NetworkCredential("username", "password");

				var mailMessage = new MailMessage
				{
					From = new MailAddress(recipient),
					Subject = subject,
					Body = message
				};
				mailMessage.To.Add(recipient);

				try
				{
					smtpClient.Send(mailMessage);
					return true;
				}
				catch (Exception ex)
				{
					_log.Error("Failed to send mail.", ex);
					return false;
				}
			}
			
		}
	}
}
