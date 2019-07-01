class TodoAppView {
  constructor(containerEl) {
    this.containerEl = containerEl;
    this.initSelectors();
  }

  initSelectors() {
    this.todoInput = this.containerEl.querySelector(".new-todo");
    this.todoList = this.containerEl.querySelector(".todo-list");
    this.todoMain = this.containerEl.querySelector(".main");
    this.todoToggleAll = this.containerEl.querySelector(".toggle-all");
    this.todoFooter = this.containerEl.querySelector(".footer");
    this.todoCount = this.containerEl.querySelector(".todo-count");
    this.todoFilters = this.containerEl.querySelector(".filters");
    this.todoClearCompleted = this.containerEl.querySelector(
      ".clear-completed"
    );
  }

  createItem(value, check = false, id) {
    let newTodo = document.createElement("li");
    newTodo.innerHTML =
      '<div class="view"><input class="toggle" type="checkbox" /><label></label><button class="destroy"></button></div>';
    newTodo.querySelector("label").innerText = value;
    newTodo.setAttribute("data-id", id);
    if (check) {
      newTodo.querySelector(".toggle").checked = check;
    }
    return newTodo;
  }

  showTodoItem(todoObj) {
    this.todoList.appendChild(
      this.createItem(todoObj.label, todoObj.checked, todoObj.id)
    );
  }

  showList(todolist) {
    this.todoList.innerHTML = "";
    for (let i = 0; i < todolist.length; i++) {
      this.showTodoItem(todolist[i]);
      this.changeStateItem(todolist[i].id, todolist[i].checked);
    }
  }
  changeStateItem(id, check) {
    let todo = this.todoList.querySelector(`li[data-id="${id}"]`);
    if (check) {
      todo.className = "completed";
    } else {
      todo.className = "";
    }
  }

  getTodoElementId(el) {
    let element = el;
    while (element != this.todoList) {
      if (element.getAttribute("data-id") != null) {
        return element.getAttribute("data-id");
      }
      element = element.parentNode;
    }
  }

  showCounter(n) {
    var plural = n === 1 ? "" : "s";
    this.todoCount.innerHTML = `<strong>${n}</strong> item${plural} left`;
  }

  editItemView(id, label) {
    let listItem = this.todoList.querySelector(`[data-id="${id}"]`);
    listItem.className = "editing";
    var input = document.createElement("input");
    input.className = "edit";
    input.value = label;
    return listItem.appendChild(input);
  }

  changeStateButton(filter) {
    this.todoFilters.querySelector(".selected").className = "";
    switch (filter) {
      case "completed":
        this.todoFilters.querySelector('a[href="#/completed"]').className =
          "selected";
        break;
      case "active":
        this.todoFilters.querySelector('a[href="#/active"]').className =
          "selected";
        break;
      default:
        this.todoFilters.querySelector('a[href="#/"]').className = "selected";
    }
  }
  stateFooter(el) {
    if (el) {
      this.showElement(this.todoFooter);
      this.showElement(this.todoMain);
    } else {
      this.hideElement(this.todoFooter);
      this.hideElement(this.todoMain);
    }
  }

  showElement(el) {
    el.style.display = "block";
  }
  hideElement(el) {
    el.style.display = "none";
  }
}
