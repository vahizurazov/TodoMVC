function TodoAppController(name, containerEl) {
  this.name = name;
  this.model = new TodoApp(name);
  this.view = new TodoAppView(containerEl);
  this.model.filterItems();
  this.view.stateFooter(this.model.items.length);
  this.view.showList(this.model.visibleItems);
  this.view.showCounter(this.model.countRemainingItem());
  // initEventListeners
  this.initEventListeners();
}
TodoAppController.prototype.initEventListeners = function() {
  this.view.todoInput.addEventListener("keyup", e => {
    if (e.keyCode == 13) {
      this.enterTodo(e);
    }
  });
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
  this.model.filterItems();
  this.view.showList(this.model.visibleItems);
  e.target.value = "";
  this.view.stateFooter(this.model.items.length);
  this.view.showCounter(this.model.countRemainingItem());
};

TodoAppController.prototype.removeTodo = function(e) {
  if (e.target.className !== "destroy") return;
  let id = this.view.getTodoElementId(e.target);
  let index = this.model.getIndexItemId(id);
  this.model.removeItem(index);
  this.model.filterItems();
  this.view.showList(this.model.visibleItems);
  this.view.stateFooter(this.model.items.length);
  this.view.showCounter(this.model.countRemainingItem());
};

TodoAppController.prototype.checkItem = function(e) {
  if (e.target.className !== "toggle") return;
  let id = this.view.getTodoElementId(e.target);
  let index = this.model.getIndexItemId(id);
  this.model.check(index);
  this.view.changeStateItem(id, this.model.items[index].checked);
  this.model.filterItems();
  this.view.showList(this.model.visibleItems);
  this.view.showCounter(this.model.countRemainingItem());
};

TodoAppController.prototype.toggleAll = function(e) {
  if (e.target.className !== "toggle-all") return;
  this.model.swichAll();
  this.model.filterItems();
  this.view.showList(this.model.visibleItems);
  if (this.model.visibleItems.length > 1) {
    this.view.showCounter(this.model.countRemainingItem());
  }
};
TodoAppController.prototype.swichselect = function(text) {
  this.model.filterItems(text);
  this.view.showList(this.model.visibleItems);
  this.view.changeStateButton(text);
};
TodoAppController.prototype.selectedAll = function(e) {
  if (e.target.tagName !== "A") return;
  let includeText = e.toElement.innerText.toLowerCase();
  switch (includeText) {
    case "completed":
      this.swichselect(includeText);
      break;
    case "active":
      this.swichselect(includeText);
      break;
    default:
      this.swichselect(includeText);
  }
};

TodoAppController.prototype.clearCompleted = function() {
  this.model.removeCompleted();
  this.model.filterItems();
  this.view.stateFooter(this.model.items.length);
  this.view.showList(this.model.visibleItems);
  this.view.showCounter(this.model.countRemainingItem());
};

TodoAppController.prototype.editItemTodo = function(e) {
  if (e.target.tagName !== "LABEL") return;
  let id = this.view.getTodoElementId(e.target);
  let index = this.model.getIndexItemId(id);
  let input = this.view.editItemView(id, this.model.items[index].label);
  input.focus();
  input.addEventListener("blur", (e)=> this.updateItem(e));
  input.addEventListener("keyup", (e)=> this.updateItem(e));
};

TodoAppController.prototype.updateItem = function(e) {
  const id = this.view.getTodoElementId(e.target);
  const index = this.model.getIndexItemId(id);
  if (e.target.value === this.model.items[index].label) return;
  if (e.type === "keyup" && e.keyCode != 13) return;
  this.model.editItem(index, e.target.value);
  e.target.removeEventListener("blur", (e)=> this.updateItem(e));
  e.target.removeEventListener("keyup", (e)=> this.updateItem(e));
  this.view.stateFooter(this.model.items.length);
  this.model.filterItems();
  this.view.showList(this.model.visibleItems);
};

var control = new TodoAppController("myApp", document.querySelector("body"));

console.log(control);
