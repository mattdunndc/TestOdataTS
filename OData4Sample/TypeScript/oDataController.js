var ODataApplication;
(function (ODataApplication) {
    //#region class Task
    var Task = (function () {
        function Task(Id, TaskName, IsComplete) {
            this.Id = Id;
            this.TaskName = TaskName;
            this.IsComplete = IsComplete;
        }
        return Task;
    })();
    //#endregion
    var ODataControllerClass = (function () {
        function ODataControllerClass($http) {
            this.$http = $http;
            //#region Properties
            this.error = "";
            this.colTasks = new Array();
            this.GetAllTasks();
        }
        //#endregion      
        //#region GetAllTasks()
        ODataControllerClass.prototype.GetAllTasks = function () {
            var vm = this;
            vm.selectedTask = null;
            var urlString = "/odata/OData4";
            var result = vm.$http({
                url: urlString,
                method: "GET"
            });
            result.then(Success, vm.Failure);
            function Success(Tasks) {
                vm.colTasks = new Array();
                Tasks.data.value.forEach(function (task) {
                    vm.colTasks.push(task);
                });
            }
        };
        //#endregion 
        //#region ShowComplete()
        ODataControllerClass.prototype.ShowComplete = function () {
            var vm = this;
            vm.selectedTask = null;
            var urlString = "/odata/OData4?$filter=IsComplete eq true";
            var result = vm.$http({
                url: urlString,
                method: "GET"
            });
            result.then(Success, vm.Failure);
            function Success(Tasks) {
                vm.colTasks = new Array();
                Tasks.data.value.forEach(function (task) {
                    vm.colTasks.push(task);
                });
            }
        };
        //#endregion 
        //#region ShowInComplete() 
        ODataControllerClass.prototype.ShowInComplete = function () {
            var vm = this;
            vm.selectedTask = null;
            var urlString = "/odata/ByStatus(IsComplete=false)";
            var result = vm.$http({
                url: urlString,
                method: "POST"
            });
            result.then(Success, vm.Failure);
            function Success(Tasks) {
                vm.colTasks = new Array();
                Tasks.data.value.forEach(function (task) {
                    vm.colTasks.push(task);
                });
            }
        };
        //#endregion 
        //#region NewTask() 
        ODataControllerClass.prototype.NewTask = function () {
            var vm = this;
            // Add a new Task - set default values
            vm.selectedTask = new Task(-1, "[New Task]", false);
        };
        //#endregion 
        //#region Save() 
        ODataControllerClass.prototype.Save = function () {
            var vm = this;
            var urlString = "";
            var method = "";
            if (vm.selectedTask.Id !== -1) {
                // Perform an Update
                urlString = "/odata/OData4(" + vm.selectedTask.Id + ")";
                method = "PUT";
            }
            else {
                // Perform an Insert
                urlString = "/odata/OData4";
                method = "POST";
            }
            var result = vm.$http({
                url: urlString,
                method: method,
                data: vm.selectedTask
            });
            result.then(Success, vm.Failure);
            function Success(Task) {
                vm.GetAllTasks();
            }
            ;
        };
        //#endregion
        //#region Delete()
        ODataControllerClass.prototype.Delete = function () {
            var vm = this;
            var urlString = "/odata/OData4(" + vm.selectedTask.Id + ")";
            var result = vm.$http({
                url: urlString,
                method: "DELETE"
            });
            result.then(Success);
            function Success(Task) {
                vm.GetAllTasks();
            }
            ;
        };
        //#endregion
        //#region Failure(error: any)
        ODataControllerClass.prototype.Failure = function (error) {
            var vm = this;
            if (error.message != undefined) {
                vm.error = error.message;
            }
            else if (error.statusText != undefined) {
                vm.error = error.statusText;
                if (error.data != undefined) {
                    if (error.data.error != undefined) {
                        if (error.data.error.innererror != undefined) {
                            if (error.data.error.innererror.message != undefined) {
                                vm.error = vm.error + ", " + error.data.error.innererror.message;
                            }
                        }
                    }
                }
            }
            else {
                vm.error = "Unknown error";
            }
            alert(vm.error);
        };
        return ODataControllerClass;
    })();
    ODataApplication.ODataControllerClass = ODataControllerClass;
    ODataApplication.ODataApp.oDataAppModule
        .controller("oDataController", ["$http", ODataControllerClass]);
})(ODataApplication || (ODataApplication = {}));
//# sourceMappingURL=oDataController.js.map