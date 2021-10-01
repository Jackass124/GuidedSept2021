namespace Terrasoft.Configuration 
{ 
    using System.ServiceModel; 
    using System.ServiceModel.Web; 
    using System.ServiceModel.Activation; 
    using Terrasoft.Core.DB;
    using Terrasoft.Web.Common; 
    using System; 
    using System.Web.SessionState;
    [ServiceContract] 
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)] 
    public class RealtyRequestService : BaseService, IReadOnlySessionState
    {
        [OperationContract] 
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.Wrapped, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public int GetCountByStatusId(string statusId) 
        { 
            if (string.IsNullOrEmpty(statusId)) 
            { 
                return -1; 
            } 
            int result = 0; 
            Select select = new Select(UserConnection)
                .Column(Func.Count("Id"))
                .From("UsrRealty")
                .Where("UsrStatusId").IsEqual(Column.Parameter(new Guid(statusId))) as Select; // select NN from TTT where UsrStatusId = :P1
            result = select.ExecuteScalar<int>();
            return result;
        }
    }
}