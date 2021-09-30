 namespace Terrasoft.Configuration
{
	using Terrasoft.Core;
	using System.ServiceModel;
	using System.ServiceModel.Activation;
	using System.ServiceModel.Web;
	using System.Web;
	using Terrasoft.Web.Common;

	 
	public class MyClass
	{
		public string MyMethod(UserConnection uc) {
			var contact = new Terrasoft.Configuration.Contact(uc);
			contact.Address = "AAA";
			contact.JobTitle = "Boss";
			contact.SetDefColumnValues();
			contact.SetColumnValue("Name", "New contact");
			contact.OwnerId = uc.CurrentUser.ContactId;
			contact.MobilePhone = "997-731-2264";
			contact.Email = "some_email@someserver.com";
			contact.Save();

			return "My answer message - OK!";
		}
		public string MethodTwo() {
			return "Method Two OK!";
		}
	};
	 
	 [ServiceContract]
	 [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	 public class MyService : BaseService, System.Web.SessionState.IReadOnlySessionState
	 {
		 [OperationContract]
		 [WebInvoke(Method = "GET", UriTemplate = "TestMethod", ResponseFormat = WebMessageFormat.Json)]
		 public string MyMethod() {
			 var appConnection = HttpContext.Current.Application["AppConnection"] as AppConnection;
			 var userName = appConnection.SystemUserConnection.CurrentUser.Name;
			 var contact = new Terrasoft.Configuration.Contact(appConnection.SystemUserConnection);
			 contact.Address = "AAA";
			 contact.JobTitle = "Boss";
			 contact.SetDefColumnValues();
			 contact.SetColumnValue("Name", "New contact");
			 contact.OwnerId = appConnection.SystemUserConnection.CurrentUser.ContactId;
			 contact.MobilePhone = "997-731-2264";
			 contact.Email = "some_email@someserver.com";
			 contact.Save();
			 return "My answer message - OK!";
		 }
		 [OperationContract]
		 [WebInvoke(Method = "GET", ResponseFormat = WebMessageFormat.Json)]
		 public string MethodTwo() {
			return "Method Two OK!";
		 }
	 }
}
