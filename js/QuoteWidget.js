
import UIComponent from "./UIComponent.js";

export default class QuoteWidget extends UIComponent {
  constructor(config) {
    super({
      title: config.title ?? "Цитата дня",
      id: config.id
    });

    this.requestController = null;
  }

  render() {
    const widget = super.render();

    const quoteElement = document.createElement("blockquote");
    quoteElement.className = "quote-text";

    const authorElement = document.createElement("cite");
    authorElement.className = "quote-author";

    const statusElement = document.createElement("p");
    statusElement.className = "quote-status";
    statusElement.setAttribute("role", "status");
    statusElement.setAttribute("aria-live", "polite");

    const refreshButton = document.createElement("button");
    refreshButton.type = "button";
    refreshButton.textContent = "Новая цитата";

    this.contentElement.append(
      quoteElement,
      authorElement,
      statusElement,
      refreshButton
    );

    this.quoteElement = quoteElement;
    this.authorElement = authorElement;
    this.statusElement = statusElement;

    this.addListener(refreshButton, "click", () => {
      this.loadQuote();
    });

    this.loadQuote();

    return widget;
  }

  async loadQuote() {
    // Отменяем предыдущий запрос, если пользователь нажал кнопку повторно.
    if (this.requestController) {
      this.requestController.abort();
    }

    const controller = new AbortController();
    this.requestController = controller;

    this.quoteElement.textContent = "";
    this.authorElement.textContent = "";
    this.statusElement.textContent = "Загружаем цитату...";

    try {
      const response = await fetch(
        "https://dummyjson.com/quotes/random",
        { signal: controller.signal }
      );

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const data = await response.json();

      // Не позволяем старому запросу перезаписать новый результат.
      if (
        controller.signal.aborted ||
        this.requestController !== controller
      ) {
        return;
      }

      if (
        typeof data.quote !== "string" ||
        typeof data.author !== "string" ||
        !data.quote.trim() ||
        !data.author.trim()
      ) {
        this.statusElement.textContent =
          "Не удалось получить корректную цитату.";
        return;
      }

      this.quoteElement.textContent = `«${data.quote}»`;
      this.authorElement.textContent = `— ${data.author}`;
      this.statusElement.textContent = "";
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }

      if (this.requestController !== controller) {
        return;
      }

      this.statusElement.textContent =
        "Не удалось загрузить цитату. Проверь интернет и попробуй ещё раз.";
    } finally {
      if (this.requestController === controller) {
        this.requestController = null;
      }
    }
  }

  destroy() {
    if (this.requestController) {
      this.requestController.abort();
      this.requestController = null;
    }

    super.destroy();

    this.quoteElement = null;
    this.authorElement = null;
    this.statusElement = null;
  }
}
