function TodoAppController(name, containerEl) {
  this.name = name;
  this.model = new TodoApp(name);
  this.view = new TodoAppView(containerEl);
  //initStateApp
  this.initStateApp();
  // initEventListeners
  this.initEventListeners();
}

TodoAppController.prototype.initStateApp = function() {
  this.model.filterItems();
  this.view.stateFooter(this.model.items.length);
  this.view.showList(this.model.visibleItems);
  this.view.showCounter(this.model.countRemainingItem());
  this.toggleState();
};

TodoAppController.prototype.initEventListeners = function() {
  this.view.todoInput.addEventListener("keyup", e => {
    if (e.keyCode === 13) {
      this.enterTodo(e);
    }
  });
  this.view.todoInput.addEventListener("blur", e => this.enterTodo(e));
  this.view.todoList.addEventListener("click", e => this.removeTodo(e));
  this.view.todoList.addEventListener("click", e => this.checkItem(e));
  this.view.todoToggleAll.addEventListener("click", e => this.toggleAll(e));
  this.view.todoFilters.addEventListener("click", e => this.selectedAll(e));
  this.view.todoClearCompleted.addEventListener("click", e =>
    this.clearCompleted(e)
  );
  this.view.todoList.addEventListener("dblclick", e => this.editItemTodo(e));
};

TodoAppController.prototype.enterTodo = function(e) {
  this.model.addItem(e.target.value, this.model.createItemId());
  this.initStateApp();
  e.target.value = "";
};

TodoAppController.prototype.removeTodo = function(e) {
  if (e.target.className !== "destroy") return;
  let id = this.view.getTodoElementId(e.target);
  let index = this.model.getIndexItemId(id);
  this.model.removeItem(index);
  this.initStateApp();
};
TodoAppController.prototype.toggleState = function() {
  let state = this.model.visibleItems.every(el => el.checked);
  if (!state) {
    this.view.todoToggleAll.checked = false;
  } else {
    this.view.todoToggleAll.checked = true;
  }
};

TodoAppController.prototype.checkItem = function(e) {
  if (e.target.className !== "toggle") return;
  let id = this.view.getTodoElementId(e.target);
  let index = this.model.getIndexItemId(id);
  this.model.check(index);
  this.view.changeStateItem(id, this.model.items[index].checked);
  this.toggleState(e);
  this.initStateApp();
};
TodoAppController.prototype.toggleAll = function(e) {
  if (e.target.className !== "toggle-all") return;
  this.model.swichAll();
  this.initStateApp();
  if (this.model.visibleItems.length > 1) {
    this.view.showCounter(this.model.countRemainingItem());
  }
};
TodoAppController.prototype.swichSelect = function(text) {
  if (text === "") {
    text = "all";
  }
  this.model.filterItems(text);
  this.view.showList(this.model.visibleItems);
  this.view.changeStateButton(text);
};
TodoAppController.prototype.selectedAll = function(e) {
  if (e.target.tagName !== "A") return;
  let includeText = e.target.hash
    .toString()
    .split("")
    .splice(2, 15)
    .join("");
  switch (includeText) {
    case "completed":
      this.swichSelect(includeText);
      break;
    case "active":
      this.swichSelect(includeText);
      break;
    default:
      this.swichSelect(includeText);
  }
};

TodoAppController.prototype.clearCompleted = function() {
  this.model.removeCompleted();
  this.initStateApp();
};

TodoAppController.prototype.editItemTodo = function(e) {
  if (e.target.tagName !== "LABEL") return;
  let id = this.view.getTodoElementId(e.target);
  let index = this.model.getIndexItemId(id);
  let input = this.view.editItemView(id, this.model.items[index].label);
  input.focus();
  input.addEventListener("blur", e => this.updateItem(e));
  input.addEventListener("keyup", e => this.updateItem(e));
};

TodoAppController.prototype.updateItem = function(e) {
  const id = this.view.getTodoElementId(e.target);
  const index = this.model.getIndexItemId(id);
  if (e.type === "keyup" && e.keyCode != 13) return;
  this.model.editItem(index, e.target.value);
  e.target.removeEventListener("blur", e => this.updateItem(e));
  e.target.removeEventListener("keyup", e => this.updateItem(e));

  this.initStateApp();
};

var control = new TodoAppController("myApp", document.querySelector("body"));