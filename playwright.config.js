// playwright.config.js

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  use: {
    // Указываем базовый URL для API
    baseURL: 'https://your-api-url.com',  // Замени на свой базовый URL

    // Запускаем API тесты в параллель
    workers: 1,

    // Включаем возможность делать снимки экрана при падении теста
    screenshot: 'only-on-failure',

    // Включаем видео-запись при падении тестов (если требуется)
    video: 'retain-on-failure',

    // Запускаем тесты в режиме, где будет доступен дебаг
    trace: 'on',  // Можно выставить 'off' или 'retain-on-failure'

    // Ограничение на время выполнения одного теста
    timeout: 30000,  // 30 секунд на каждый тест
  },

  // Параметры для запуска на разных платформах и браузерах
  projects: [
    {
      name: 'API Tests',
      use: {
        // Можем запускать без браузера, только для API тестов
        browserName: 'chromium',
      },
    },
  ],

  // Путь к папке, где будут храниться отчёты об ошибках и тестах
  reporter: [['list'], ['json', { outputFile: 'results.json' }]],

  // Путь к выходным данным о трассировках для дебага
  outputDir: 'test-results/',

  // Можем задать количество параллельно выполняемых тестов
  workers: process.env.CI ? 1 : undefined,
});
