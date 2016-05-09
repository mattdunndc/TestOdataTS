module ODataApplication {

    //#region class Task
    class Task {
        constructor(Id: number, TaskName: string, IsComplete: boolean) {
            this.Id = Id;
            this.TaskName = TaskName;
            this.IsComplete = IsComplete;
        }

        Id: number;
        TaskName: string;
        IsComplete: boolean;
    }
    //#endregion

    export class ODataControllerClass {
        constructor(private $http: ng.IHttpService) {
            this.GetAllTasks();
        }

        //#region Properties
        error: string = "";
        colTasks: Array<Task> = new Array<Task>();
        selectedTask: Task;
        //#endregion      

        //#region GetAllTasks()
        GetAllTasks() {
            var vm: ODataControllerClass = this;
            vm.selectedTask = null;

            var urlString: string = "/odata/OData4";
            var result: any = vm.$http({
                url: urlString,
                method: "GET"
            });

            result.then(Success, vm.Failure)

            function Success(Tasks: any) {
                vm.colTasks = new Array<Task>();
                Tasks.data.value.forEach(task => {
                    vm.colTasks.push(task);
                });
            }
        }
        //#endregion 

        //#region ShowComplete()
        ShowComplete() {
            var vm: ODataControllerClass = this;
            vm.selectedTask = null;

            var urlString: string =
                "/odata/OData4?$filter=IsComplete eq true";

            var result: any = vm.$http({
                url: urlString,
                method: "GET"
            });

            result.then(Success, vm.Failure)

            function Success(Tasks: any) {
                vm.colTasks = new Array<Task>();
                Tasks.data.value.forEach(task => {
                    vm.colTasks.push(task);
                });
            }
        }
        //#endregion 

        //#region ShowInComplete() 
        ShowInComplete() {
            var vm: ODataControllerClass = this;
            vm.selectedTask = null;

            var urlString: string =
                "/odata/ByStatus(IsComplete=false)";

            var result: any = vm.$http({
                url: urlString,
                method: "POST"
            });

            result.then(Success, vm.Failure)

            function Success(Tasks: any) {
                vm.colTasks = new Array<Task>();
                Tasks.data.value.forEach(task => {
                    vm.colTasks.push(task);
                });
            }
        }
        //#endregion 

        //#region NewTask() 
        NewTask() {
            var vm: ODataControllerClass = this;

            // Add a new Task - set default values
            vm.selectedTask = new Task(-1, "[New Task]", false);
        }
        //#endregion 

        //#region Save() 
        Save() {
            var vm: ODataControllerClass = this;
            var urlString: string = "";
            var method: string = "";

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

            var result: any = vm.$http({
                url: urlString,
                method: method,
                data: vm.selectedTask
            });

            result.then(Success, vm.Failure)

            function Success(Task: any) {
                vm.GetAllTasks();
            };
        }
        //#endregion

        //#region Delete()
        Delete() {
            var vm: ODataControllerClass = this;

            var urlString: string = "/odata/OData4(" + vm.selectedTask.Id + ")";

            var result: any = vm.$http({
                url: urlString,
                method: "DELETE"
            });

            result.then(Success)

            function Success(Task: any) {
                vm.GetAllTasks();
            };
        }
        //#endregion

        //#region Failure(error: any)
        Failure(error: any) {
            var vm: ODataControllerClass = this;
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
        }
        //#endregion

    }

    ODataApp.oDataAppModule
        .controller("oDataController", ["$http", ODataControllerClass]);
}