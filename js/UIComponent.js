
export default class UIComponent {
  constructor({ title, id }) {
    if (new.target === UIComponent) {
      throw new Error(
        "UIComponent — базовый класс. Создавайте конкретные виджеты."
      );
    }

    this.title = title;
    this.id = id;
    this.element = null;
    this.listeners = [];
    this.isMinimized = false;
  }

  // Регистрируем обработчик, чтобы потом удалить его
  addListener(element, event, handler) {
    element.addEventListener(event, handler);

    this.listeners.push({
      element,
      event,
      handler
    });
  }

  // Создаём общую оболочку виджета
  render() {
    const widget = document.createElement("article");
    widget.className = "widget";
    widget.id = this.id;

    const header = document.createElement("header");
    header.className = "widget__header";

    const heading = document.createElement("h3");
    heading.className = "widget__title";
    heading.textContent = this.title;

    const controls = document.createElement("div");
    controls.className = "widget__controls";

    const minimizeButton = document.createElement("button");
    minimizeButton.type = "button";
    minimizeButton.textContent = "Свернуть";
    minimizeButton.setAttribute("aria-label", `Свернуть: ${this.title}`);

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.textContent = "Удалить";
    closeButton.setAttribute("aria-label", `Удалить: ${this.title}`);

    const content = document.createElement("div");
    content.className = "widget__content";

    controls.append(minimizeButton, closeButton);
    header.append(heading, controls);
    widget.append(header, content);

    this.element = widget;
    this.contentElement = content;

    this.addListener(minimizeButton, "click", () => {
      this.minimize();
    });

    this.addListener(closeButton, "click", () => {
      this.close();
    });

    return widget;
  }

  // Сворачиваем или разворачиваем содержимое
  minimize() {
    if (!this.contentElement) return;

    this.isMinimized = !this.isMinimized;
    this.contentElement.hidden = this.isMinimized;

    const button = this.element.querySelector(
      ".widget__controls button"
    );

    if (button) {
      button.textContent = this.isMinimized
        ? "Развернуть"
        : "Свернуть";

      button.setAttribute(
        "aria-expanded",
        String(!this.isMinimized)
      );
    }
  }

  // Закрываем виджет и очищаем ресурсы
close() {
  if (this.onClose) {
    this.onClose();
  } else {
    this.destroy();
  }
}

  destroy() {
    for (const { element, event, handler } of this.listeners) {
      element.removeEventListener(event, handler);
    }

    this.listeners = [];

    if (this.element) {
      this.element.remove();
    }

    this.element = null;
    this.contentElement = null;
  }
}
