
import UIComponent from "./UIComponent.js";

export default class WeatherWidget extends UIComponent {
  constructor(config) {
    super({
      title: config.title ?? "Погода",
      id: config.id
    });

    this.requestController = null;
  }

  render() {
    const widget = super.render();

    const cityElement = document.createElement("h4");
    cityElement.textContent = "Санкт-Петербург";

    const temperatureElement = document.createElement("p");
    temperatureElement.className = "weather-temperature";

    const descriptionElement = document.createElement("p");
    descriptionElement.className = "weather-description";

    const statusElement = document.createElement("p");
    statusElement.className = "weather-status";
    statusElement.setAttribute("role", "status");
    statusElement.setAttribute("aria-live", "polite");

    const refreshButton = document.createElement("button");
    refreshButton.type = "button";
    refreshButton.textContent = "Обновить погоду";

    this.contentElement.append(
      cityElement,
      temperatureElement,
      descriptionElement,
      statusElement,
      refreshButton
    );

    this.temperatureElement = temperatureElement;
    this.descriptionElement = descriptionElement;
    this.statusElement = statusElement;

    this.addListener(refreshButton, "click", () => {
      this.loadWeather();
    });

    this.loadWeather();

    return widget;
  }


async loadWeather() {
  if (this.requestController) {
    this.requestController.abort();
  }

  const controller = new AbortController();
  this.requestController = controller;

  this.temperatureElement.textContent = "";
  this.descriptionElement.textContent = "";
  this.statusElement.textContent = "Загружаем погоду...";

  try {
    const url =
      "https://api.open-meteo.com/v1/forecast" +
      "?latitude=59.9386" +
      "&longitude=30.3141" +
      "&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m" +
      "&timezone=Europe%2FMoscow";

    const response = await fetch(url, {
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    const data = await response.json();

    if (
      controller.signal.aborted ||
      this.requestController !== controller
    ) {
      return;
    }

    const current = data.current;

    if (
      !current ||
      typeof current.temperature_2m !== "number" ||
      typeof current.weather_code !== "number"
    ) {
      throw new Error("Получены некорректные данные о погоде");
    }

    const weatherDescriptions = {
      0: "Ясно",
      1: "Преимущественно ясно",
      2: "Переменная облачность",
      3: "Пасмурно",
      45: "Туман",
      48: "Изморозевый туман",
      51: "Лёгкая морось",
      53: "Умеренная морось",
      55: "Сильная морось",
      56: "Лёгкая ледяная морось",
      57: "Сильная ледяная морось",
      61: "Небольшой дождь",
      63: "Умеренный дождь",
      65: "Сильный дождь",
      66: "Лёгкий ледяной дождь",
      67: "Сильный ледяной дождь",
      71: "Небольшой снег",
      73: "Умеренный снег",
      75: "Сильный снег",
      77: "Снежная крупа",
      80: "Небольшие ливни",
      81: "Умеренные ливни",
      82: "Сильные ливни",
      85: "Слабый снегопад",
      86: "Сильный снегопад",
      95: "Гроза",
      96: "Гроза с небольшим градом",
      99: "Гроза с сильным градом"
    };

    this.temperatureElement.textContent =
      `Температура: ${Math.round(current.temperature_2m)} °C`;

    this.descriptionElement.textContent =
      weatherDescriptions[current.weather_code] ??
      "Описание погоды недоступно";

    if (typeof current.apparent_temperature === "number") {
      this.descriptionElement.textContent +=
        `. Ощущается как ${Math.round(current.apparent_temperature)} °C`;
    }

    if (typeof current.relative_humidity_2m === "number") {
      this.descriptionElement.textContent +=
        `. Влажность ${current.relative_humidity_2m}%`;
    }

    if (typeof current.wind_speed_10m === "number") {
      this.descriptionElement.textContent +=
        `. Ветер ${Math.round(current.wind_speed_10m)} км/ч`;
    }

    this.statusElement.textContent = "";
  } catch (error) {
    if (error.name === "AbortError") {
      return;
    }

    if (this.requestController !== controller) {
      return;
    }

    this.statusElement.textContent =
      "Не удалось загрузить погоду. Проверь интернет и попробуй снова.";
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

    this.temperatureElement = null;
    this.descriptionElement = null;
    this.statusElement = null;
  }
}
