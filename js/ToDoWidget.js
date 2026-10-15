
import UIComponent from "./UIComponent.js";

export default class ToDoWidget extends UIComponent {
  constructor(config) {
    super({
      title: config.title ?? "Список дел",
      id: config.id
    });

    // Состояние списка хранится внутри экземпляра
    this.tasks = [];
    this.nextTaskId = 1;
  }

  render() {
    const widget = super.render();

    const form = document.createElement("form");
    form.className = "todo-form";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Что нужно сделать?";
    input.setAttribute("aria-label", "Новая задача");
    input.maxLength = 200;
    input.required = true;

    const addButton = document.createElement("button");
    addButton.type = "submit";
    addButton.textContent = "Добавить";

    form.append(input, addButton);

    const counter = document.createElement("p");
    counter.className = "todo-counter";
    counter.setAttribute("aria-live", "polite");

    const list = document.createElement("ul");
    list.className = "todo-list";

    this.contentElement.append(form, counter, list);

    this.inputElement = input;
    this.counterElement = counter;
    this.listElement = list;

    // Добавляем новую задачу при отправке формы
    this.addListener(form, "submit", (event) => {
      event.preventDefault();

      const title = this.inputElement.value.trim();

      if (!title) return;

      this.addTask(title);
      this.inputElement.value = "";
      this.inputElement.focus();
    });

    // Обрабатываем отметку выполнения через делегирование
    this.addListener(list, "change", (event) => {
      const checkbox = event.target;

      if (!checkbox.matches("[data-task-checkbox]")) return;

      const taskId = Number(checkbox.dataset.taskId);
      this.toggleTask(taskId);
    });

    // Удаляем задачу через делегирование событий
    this.addListener(list, "click", (event) => {
      const button = event.target.closest("[data-delete-task]");

      if (!button || !list.contains(button)) return;

      this.removeTask(Number(button.dataset.taskId));
    });

    this.renderTasks();

    return widget;
  }

  addTask(title) {
    const task = {
      id: this.nextTaskId++,
      title,
      completed: false
    };

    this.tasks.push(task);
    this.renderTasks();
  }

  toggleTask(taskId) {
    const task = this.tasks.find((item) => item.id === taskId);

    if (!task) return;

    task.completed = !task.completed;
    this.renderTasks();
  }

  removeTask(taskId) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    this.renderTasks();
  }

  renderTasks() {
    if (!this.listElement) return;

    this.listElement.replaceChildren();

    const completedCount = this.tasks.filter(
      (task) => task.completed
    ).length;

    this.counterElement.textContent =
      `Выполнено: ${completedCount} из ${this.tasks.length}`;

    if (this.tasks.length === 0) {
      const emptyMessage = document.createElement("li");
      emptyMessage.textContent = "Пока нет задач. Добавь первую!";
      emptyMessage.className = "todo-empty";
      this.listElement.append(emptyMessage);
      return;
    }

    for (const task of this.tasks) {
      const item = document.createElement("li");
      item.className = "todo-item";

      const label = document.createElement("label");
      label.className = "todo-item__label";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.dataset.taskCheckbox = "";
      checkbox.dataset.taskId = String(task.id);
      checkbox.setAttribute(
        "aria-label",
        `Выполнено: ${task.title}`
      );

      const title = document.createElement("span");
      title.textContent = task.title;

      if (task.completed) {
        title.classList.add("todo-item__title--completed");
      }

      label.append(checkbox, title);

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.textContent = "Удалить";
      deleteButton.dataset.deleteTask = "";
      deleteButton.dataset.taskId = String(task.id);
      deleteButton.setAttribute(
        "aria-label",
        `Удалить задачу: ${task.title}`
      );

      item.append(label, deleteButton);
      this.listElement.append(item);
    }
  }

  destroy() {
    super.destroy();

    this.inputElement = null;
    this.counterElement = null;
    this.listElement = null;
  }
}
