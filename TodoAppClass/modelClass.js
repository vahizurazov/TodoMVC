class TodoApp {
  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.items = this.restoreState() || [];
    this.visibleItems = [];
    this.currentFilter = "all";
  }

  addItem(label, id) {
    if (label.trim() === "") {
      return;
    }
    this.items.push(new TodoItem(label, id));
    this.saveState();
  }

  editItem(itemIndex, params) {
    const { label, checked } = params;
    if (typeof params === "string" && params !== this.items[itemIndex].label) {
      if (params === "") {
        return this.removeItem(itemIndex);
      }
      this.items[itemIndex].label = params;
    }
    if (typeof checked === "boolean") {
      this.items[itemIndex].checked = checked;
    }
    this.saveState();
  }

  removeItem(itemIndex) {
    this.items.splice(itemIndex, 1);
    this.saveState();
  }
  check(itemIndex) {
    this.items[itemIndex].checked = !this.items[itemIndex].checked;

    if (this.currentFilter !== "all") {
      this.filterItems(this.currentFilter);
    }
    this.saveState();
  }

  removeCompleted() {
    this.items = this.items.filter(item => !item.checked);
    this.saveState();
  }

  filterItems(param) {
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
  }

  swichAll() {
    let state = this.items.every(el => el.checked);
    this.items.forEach(el => (el.checked = !state));
    this.saveState();
  }

  countRemainingItem() {
    let filteredList = this.items.filter(el => !el.checked);
    return filteredList.length;
  }

  createItemId() {
    return new Date().getTime();
  }

  getIndexItemId(id) {
    return this.items.findIndex(e => e.id == id);
  }

  saveState() {
    return localStorage.setItem(
      `todo-${this.name}`,
      JSON.stringify(this.items)
    );
  }
  restoreState() {
    return JSON.parse(localStorage.getItem(`todo-${this.name}`));
  }
}

class TodoItem {
  constructor(label, id) {
    this.label = label;
    this.checked = false;
    this.id = id;
  }
}
