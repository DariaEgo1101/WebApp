
import UIComponent from "./UIComponent.js";

export default class DateWidget extends UIComponent {
  constructor(config) {
    super({
      title: config.title ?? "Мой день",
      id: config.id
    });

    this.note = "";
  }

  render() {
    const widget = super.render();

    const dateElement = document.createElement("p");
    dateElement.className = "date-widget__date";

    const greetingElement = document.createElement("h4");
    greetingElement.className = "date-widget__greeting";

    const noteLabel = document.createElement("label");
    noteLabel.textContent = "План или заметка на сегодня";
    noteLabel.htmlFor = `${this.id}-note`;

    const noteInput = document.createElement("textarea");
    noteInput.id = `${this.id}-note`;
    noteInput.placeholder = "Что важно сделать сегодня?";
    noteInput.maxLength = 1000;
    noteInput.rows = 4;

    const counterElement = document.createElement("p");
    counterElement.className = "date-widget__counter";
    counterElement.setAttribute("aria-live", "polite");

    this.contentElement.append(
      dateElement,
      greetingElement,
      noteLabel,
      noteInput,
      counterElement
    );

    this.dateElement = dateElement;
    this.greetingElement = greetingElement;
    this.noteInput = noteInput;
    this.counterElement = counterElement;

    this.updateDate();
    this.updateGreeting();
    this.updateCounter();

    this.addListener(noteInput, "input", () => {
      this.note = noteInput.value;
      this.updateCounter();
    });

    return widget;
  }

  updateDate() {
    const now = new Date();

    this.dateElement.textContent = new Intl.DateTimeFormat("ru-RU", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(now);
  }

  updateGreeting() {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      this.greetingElement.textContent = "Доброе утро!";
    } else if (hour >= 12 && hour < 18) {
      this.greetingElement.textContent = "Добрый день!";
    } else if (hour >= 18 && hour < 23) {
      this.greetingElement.textContent = "Добрый вечер!";
    } else {
      this.greetingElement.textContent = "Время для спокойного планирования.";
    }
  }

  updateCounter() {
    const remaining = 1000 - this.note.length;
    this.counterElement.textContent =
      `Символов: ${this.note.length} из 1000. Осталось: ${remaining}`;
  }

  destroy() {
    super.destroy();

    this.dateElement = null;
    this.greetingElement = null;
    this.noteInput = null;
    this.counterElement = null;
  }
}
