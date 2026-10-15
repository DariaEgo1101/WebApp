

import Dashboard from "./js/Dashboard.js";

// Находим основную панель виджетов
const dashboardElement = document.querySelector("#dashboard");

// Создаём панель управления
const dashboard = new Dashboard(dashboardElement);

// Подключаем кнопки добавления виджетов
const addTodoButton = document.querySelector("#add-todo");
const addQuoteButton = document.querySelector("#add-quote");
const addWeatherButton = document.querySelector("#add-weather");
const addDateButton = document.querySelector("#add-date");

// При нажатии создаём нужный виджет
addTodoButton.addEventListener("click", () => {
  dashboard.addWidget("todo");
});

addQuoteButton.addEventListener("click", () => {
  dashboard.addWidget("quote");
});

addWeatherButton.addEventListener("click", () => {
  dashboard.addWidget("weather");
});

addDateButton.addEventListener("click", () => {
  dashboard.addWidget("date");
});

console.log("Персональный организатор запущен!");
