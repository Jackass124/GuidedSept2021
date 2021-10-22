 namespace Terrasoft.Configuration.UsrSwimmingProgrammService
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
    public class UsrSwimmingProgrammService : BaseService, IReadOnlySessionState
    {
        [OperationContract] 
        [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.Wrapped, RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        public double GetSumBySwimmingProgramm(string swimprogram) 
        { 
				var SwimProgrammQuery = new Select(UserConnection)
				.Column("Id")
				.From("UsrSwimmingProgramm")
				.Where("UsrName")
					.IsEqual(Column.Parameter(swimprogram))
				as Select;
				var id =SwimProgrammQuery.ExecuteScalar<Guid>();
            if (id==Guid.Empty) 
            { 
                return -1; 
            } 
            double result = 0; 
            var SumLessonSwimProgrammQuery = new Select(UserConnection)
                .Column(Func.Sum("UsrLessonTimeHour"))
                .From("UsrSwimLesson")
                .Where("UsrSwimmingProgrammId").IsEqual(Column.Parameter(id)) as Select; // select NN from TTT where UsrStatusId = :P1
            result = SumLessonSwimProgrammQuery.ExecuteScalar<double>();
            return result;
        }
    }
}