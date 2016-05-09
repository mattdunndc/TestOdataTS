using Microsoft.OData.Edm;
using System.Web.Http;
using System.Web.OData.Builder;
using System.Web.OData.Extensions;

namespace OData4Sample.App_Start
{
    class WebApiConfig
    {
        #region Register
        public static void Register(HttpConfiguration config)
        {
            // Web API routes 
            config.MapHttpAttributeRoutes();

            config.MapODataServiceRoute(
               routeName: "ODataRoute",
               routePrefix: "odata",
               model: GenerateEntityDataModel());

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
        #endregion

        #region GenerateEntityDataModel
        private static IEdmModel GenerateEntityDataModel()
        {
            ODataModelBuilder builder = new ODataConventionModelBuilder();

            // Queryable DTOTask
            builder.EntitySet<Models.DTOTask>("OData4");

            // FilterByStatus function that takes a parameter and returns Tasks
            var ByStatusFunction = builder.Function("ByStatus");
            ByStatusFunction.ReturnsCollectionFromEntitySet<Models.DTOTask>("DTOTasks");
            ByStatusFunction.Parameter<System.Boolean>("IsComplete");

            return builder.GetEdmModel();
        }
        #endregion
    }
}
