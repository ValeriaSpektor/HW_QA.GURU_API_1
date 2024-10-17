import { test, expect } from "@playwright/test";

test.describe("API challenge", () => {
  let URL = "https://apichallenges.herokuapp.com/";
  let token;

  // Получаем токен перед тестами
  test.beforeAll(async ({ request }) => {
    let response = await request.post(`${URL}challenger`);
    let headers = await response.headers();
    token = headers["x-challenger"];
    console.log('Токен: ' + token);

    expect(headers).toEqual(
      expect.objectContaining({ "x-challenger": expect.any(String) }),
    );
  });

  // Тест для получения списка заданий
  test("Получить список заданий @list", async ({ request }) => {
    let response = await request.get(`${URL}challenges`, {
      headers: {
        "x-challenger": token,
      },
    });
    let body = await response.json();
    let headers = await response.headers();

    expect(response.status()).toBe(200);
    expect(headers).toEqual(expect.objectContaining({ "x-challenger": token }));
    expect(body.challenges.length).toBe(59);
  });

  // Тест для редактирования задания
  test("Отредактировать задание @edit", async ({ request }) => {
    const todo = {
      doneStatus: true,
      description: "реклама",
    };
    let response = await request.put(`${URL}todos/122222`, {
      headers: {
        "x-challenger": token,
      },
      data: todo,
    });
    let body = await response.json();
    let headers = await response.headers();

    expect(response.status()).toBe(400);  // Ожидаем 400 Bad Request
  });

  // Тест для создания нового задания
  test("Создать новое задание @create", async ({ request }) => {
    const newTask = {
      title: "Новое задание",
      doneStatus: false,
      description: "Описание нового задания",
    };
    let response = await request.post(`${URL}todos`, {
      headers: {
        "x-challenger": token,
      },
      data: newTask,
    });
    let body = await response.json();

    expect(response.status()).toBe(201);  // Ожидаем 201 Created
    expect(body.title).toBe("Новое задание");
    expect(body.doneStatus).toBe(false);
  });

  // Исправленный тест: Создать и удалить задание
  test("Создать и удалить задание @create-delete", async ({ request }) => {
    // Сначала создаем новое задание
    const newTask = {
      title: "Задание для удаления",
      doneStatus: false,
      description: "Это задание будет удалено",
    };
    let createResponse = await request.post(`${URL}todos`, {
      headers: {
        "x-challenger": token,
      },
      data: newTask,
    });
    let createdTask = await createResponse.json();
    let taskId = createdTask.id;  // Сохраняем ID созданного задания
    
    // Проверяем, что создание прошло успешно
    expect(createResponse.status()).toBe(201);
    expect(createdTask.title).toBe("Задание для удаления");

    // Теперь удаляем созданное задание
    let deleteResponse = await request.delete(`${URL}todos/${taskId}`, {
      headers: {
        "x-challenger": token,
      },
    });

    // Проверяем, что удаление прошло успешно
    expect(deleteResponse.status()).toBe(200);  // Ожидаем 200 OK
  });

  // Тест: Проверить ошибку при удалении несуществующего задания
  test("Ошибка при удалении несуществующего задания @delete", async ({ request }) => {
    const invalidTaskId = 999999;  // Несуществующий ID
    let response = await request.delete(`${URL}todos/${invalidTaskId}`, {
      headers: {
        "x-challenger": token,
      },
    });

    expect(response.status()).toBe(404);  // Ожидаем 404 Not Found
  });
});
