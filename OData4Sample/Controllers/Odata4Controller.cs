using System;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.OData;
using System.Web.OData.Routing;
using OData4Sample.Models;

namespace OData4Sample.Controllers
{
    public class OData4Controller : ODataController
    {
        private SampleDatabaseEntities db = new SampleDatabaseEntities();

        // GET: odata/OData4
        [EnableQuery(PageSize = 50)]
        public IQueryable<DTOTask> GetOData4()
        {
            var result = (from tasks in db.Tasks
                          select new DTOTask
                          {
                              Id = tasks.Id,
                              TaskName = tasks.TaskName,
                              IsComplete = tasks.IsComplete
                          });

            return result.AsQueryable();
        }

        // odata/ByStatus(paramIsComplete=false)
        [ODataRoute("ByStatus(IsComplete={isComplete})")]
        public IHttpActionResult FilterByStatus([FromODataUri] Boolean IsComplete)
        {
            var result = (from tasks in db.Tasks
                          where tasks.IsComplete == IsComplete
                          select new DTOTask
                          {
                              Id = tasks.Id,
                              TaskName = tasks.TaskName,
                              IsComplete = tasks.IsComplete
                          }).ToList();

            return Ok(result);
        }

        public IHttpActionResult Post(DTOTask task)
        {
            var NewTask = new Task();
            NewTask.TaskName = task.TaskName;
            NewTask.IsComplete = task.IsComplete;

            db.Tasks.Add(NewTask);
            db.SaveChanges();

            return Created(task);
        }

        public IHttpActionResult Put([FromODataUri] int key, DTOTask task)
        {
            Task ExistingTask = db.Tasks.Find(key);
            if (ExistingTask == null)
            {
                return StatusCode(HttpStatusCode.NotFound);
            }

            ExistingTask.TaskName = task.TaskName;
            ExistingTask.IsComplete = task.IsComplete;

            db.Entry(ExistingTask).State = EntityState.Modified;
            db.SaveChanges();

            return Updated(task);
        }

        // DELETE: odata/OData4(5)
        public IHttpActionResult Delete([FromODataUri] int key)
        {
            Task task = db.Tasks.Find(key);
            if (task == null)
            {
                return NotFound();
            }

            db.Tasks.Remove(task);
            db.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}