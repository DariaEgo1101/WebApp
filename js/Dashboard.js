
import ToDoWidget from "./ToDoWidget.js";
import QuoteWidget from "./QuoteWidget.js";
import WeatherWidget from "./WeatherWidget.js";
import DateWidget from "./DateWidget.js";

export default class Dashboard {
  constructor(container) {
    if (!container) {
      throw new Error("Не найден контейнер для панели виджетов.");
    }

    this.container = container;
    this.widgets = new Map();
    this.nextWidgetId = 1;
  }


addWidget(widgetType) {
  const widgetId = `widget-${this.nextWidgetId++}`;

  const widgetClasses = {
    todo: ToDoWidget,
    quote: QuoteWidget,
    weather: WeatherWidget,
    date: DateWidget
  };

  const WidgetClass = widgetClasses[widgetType];

  if (!WidgetClass) {
    throw new Error(`Неизвестный тип виджета: ${widgetType}`);
  }

  const widget = new WidgetClass({
    id: widgetId
  });
  widget.onClose = () => {
  this.removeWidget(widgetId);
};

  const element = widget.render();
  this.container.append(element);

  this.widgets.set(widgetId, widget);

  return widget;
}



removeWidget(widgetId) {
  const widget = this.widgets.get(widgetId);

  if (!widget) {
    return;
  }

  widget.destroy();
  this.widgets.delete(widgetId);
}



destroy() {
  for (const widgetId of this.widgets.keys()) {
    this.removeWidget(widgetId);
  }

  this.container.replaceChildren();
}
}
