using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RecipeRepo.Integrations.Email
{
	public interface IMailClient
	{
		bool SendMail(string recipient, string cc, string sender, string subject, string message);
	}
}
