function TodoApp(name, id) {
  this.name = name;
  this.items = this.restoreState() || [];
  this.visibleItems = [];
  this.currentFilter = "all";
}
function TodoItem(label, id) {
  this.label = label;
  this.checked = false;
  this.id = id;
}

TodoApp.prototype.addItem = function(label, id) {
  if (label.trim() === "") {
    return;
  }
  this.items.push(new TodoItem(label, id));
  this.saveState();
};

TodoApp.prototype.editItem = function(itemIndex, params) {
  // const { label, checked } = params;

  if (typeof params === "string" && params !== this.items[itemIndex].label) {
    if (params === "") {
      return this.removeItem(itemIndex);
    }
    this.items[itemIndex].label = params;
  }
  this.saveState();
};

TodoApp.prototype.removeItem = function(itemIndex) {
  this.items.splice(itemIndex, 1);
  this.saveState();
};

TodoApp.prototype.check = function(itemIndex) {
  this.items[itemIndex].checked = !this.items[itemIndex].checked;

  if (this.currentFilter != "all") {
    this.filterItems(this.currentFilter);
  }
  this.saveState();
};

TodoApp.prototype.removeCompleted = function() {
  this.items = this.items.filter(item => !item.checked);
  this.saveState();
};

TodoApp.prototype.filterItems = function(param) {
  const newFilter = param || this.currentFilter;
  if (this.currentFilter === newFilter && this.items === this.visibleItems)
    return;
  this.currentFilter = newFilter;
  switch (newFilter) {
    case "completed":
      this.visibleItems = this.items.filter(item => item.checked);
      break;
    case "active":
      this.visibleItems = this.items.filter(item => !item.checked);
      break;
    default:
      this.visibleItems = this.items;
  }
};

TodoApp.prototype.swichAll = function() {
  let state = this.items.every(el => el.checked);
  this.items.forEach(el => (el.checked = !state));
  this.saveState();
};

TodoApp.prototype.countRemainingItem = function() {
  let filteredList = this.items.filter(el => !el.checked);
  return filteredList.length;
};

TodoApp.prototype.createItemId = function() {
  return new Date().getTime();
};

TodoApp.prototype.getIndexItemId = function(id) {
  return this.items.findIndex(e => e.id == id);
};

TodoApp.prototype.saveState = function() {
  try {
  return localStorage.setItem(`todo-${this.name}`, JSON.stringify(this.items));
} catch (e) {console.log('ERROR') }
};
TodoApp.prototype.restoreState = function() {
  try{
  return JSON.parse(localStorage.getItem(`todo-${this.name}`));
} catch (e) {console.log('ERROR') }
};


