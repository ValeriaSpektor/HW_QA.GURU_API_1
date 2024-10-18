import { test, expect } from "@playwright/test";

test.describe("API challenge", () => {
    const URL = 'https://apichallenges.herokuapp.com/';
    let token;
  
    // Получение токена авторизации перед всеми тестами
    test.beforeAll(async ({ request }) => {
      const response = await request.post(`${URL}challenger`);
      const headers = await response.headers();
      token = headers["x-challenger"];
      console.log("Это токен: " + token);
      expect(headers).toEqual(expect.objectContaining({ "x-challenger": expect.any(String) }));
    });

  // 1. GET /challenges
  test("1. GET /challenges should return 200 and contain 59 challenges", async ({ request }) => {
    const response = await request.get(`${URL}challenges`, {
      headers: {
        "x-challenger": token,
      },
    });
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.challenges.length).toBe(59);
  });

  // 2. POST /todos with valid data
  test("2. POST /todos should return 201 on valid data", async ({ request }) => {
    const todo = { title: "New Todo", description: "Todo description" };
    const response = await request.post(`${URL}todos`, {
      headers: { "x-challenger": token },
      data: todo,
    });
    expect(response.status()).toBe(201);
  });

  // 3. POST /todos with invalid doneStatus
  test("3. POST /todos should return 400 when doneStatus is invalid", async ({ request }) => {
    const todo = { title: "New Todo", doneStatus: "invalid" };
    const response = await request.post(`${URL}todos`, {
      headers: { "x-challenger": token },
      data: todo,
    });
    expect(response.status()).toBe(400);
  });

  // 4. POST /todos with long title
  test("4. POST /todos should return 400 when title exceeds length", async ({ request }) => {
    const longTitle = "A".repeat(201); // Max title length 200
    const todo = { title: longTitle, description: "Description" };
    const response = await request.post(`${URL}todos`, {
      headers: { "x-challenger": token },
      data: todo,
    });
    expect(response.status()).toBe(400);
  });

  // 5. POST and GET valid /todos/{id}
  test('5. POST and GET /todos/{id} should return 200 for valid ID', async ({ request }) => {
    const postResponse = await request.post(`${URL}todos`, {
      headers: { 'X-Challenger': token },
      data: { title: 'Test Todo', description: 'Test description' },
    });
    expect(postResponse.status()).toBe(201);
    const postResponseBody = await postResponse.json();
    const createdTodoId = postResponseBody.id;

    const getResponse = await request.get(`${URL}todos/${createdTodoId}`, {
      headers: { 'X-Challenger': token }
    });
    expect(getResponse.status()).toBe(200);
  });

  // 6. GET /todos/{id} for non-existent ID
  test('6. GET /todos/{id} should return 404 for non-existent ID', async ({ request }) => {
    const response = await request.get(`${URL}todos/9999`, {
      headers: { 'X-Challenger': token }
    });
    expect(response.status()).toBe(404);
  });

  // 7. POST /todos with large payload
  test("7. POST /todos should return 413 when payload exceeds maximum length", async ({ request }) => {
    const todo = { title: "Valid title", description: "A".repeat(5001) };
    const response = await request.post(`${URL}todos`, {
      headers: { "x-challenger": token },
      data: todo,
    });
    expect(response.status()).toBe(413);
  });

  // 8. POST /todos with extra fields
  test("8. POST /todos should return 400 when extra fields are provided", async ({ request }) => {
    const todo = { title: "Valid title", extraField: "Not allowed" };
    const response = await request.post(`${URL}todos`, {
      headers: { "x-challenger": token },
      data: todo,
    });
    expect(response.status()).toBe(400);
  });

  // 9. Получение задачи по ID (валидный ID)
  test("9. GET /todos/{id} should return 200 for valid ID", async ({ request }) => {
    const response = await request.get(`${URL}todos/1`, {
      headers: {
        "x-challenger": token,
      },
    });
    expect(response.status()).toBe(200);
  });

  // 10. Ошибка при запросе задачи по несуществующему ID
  test("10. GET /todos/{id} should return 404 for non-existent ID", async ({ request }) => {
    const response = await request.get(`${URL}todos/9999`, {
      headers: {
        "x-challenger": token,
      },
    });
    expect(response.status()).toBe(404);
  });

  // 11. Получение всех задач
  test("11. GET /todos should return 200", async ({ request }) => {
    const response = await request.get(`${URL}todos`, {
      headers: {
        "x-challenger": token,
      },
    });
    expect(response.status()).toBe(200);
  });

  // 12. Ошибка при запросе задачи в единственном числе (некорректный эндпоинт)
  test("12. GET /todo (singular) should return 404", async ({ request }) => {
    const response = await request.get(`${URL}todo`, {
      headers: {
        "x-challenger": token,
      },
    });
    expect(response.status()).toBe(404);
  });

  // 13. HEAD запрос для проверки существования задач
  test("13. HEAD /todos should return 200", async ({ request }) => {
    const response = await request.head(`${URL}todos`, {
      headers: {
        "x-challenger": token,
      },
    });
    expect(response.status()).toBe(200);
  });

  // 14. Обновление задачи (валидные данные)
  test("14. PUT /todos/{id} should return 200 on valid update", async ({ request }) => {
    const todo = {
      title: "Updated title",
      description: "Updated description",
    };
    const response = await request.put(`${URL}todos/1`, {
      headers: {
        "x-challenger": token,
      },
      data: todo,
    });
    const body = await response.json();
    console.log('Response body:', body); // Отладочный вывод
    expect(response.status()).toBe(200); // Ожидаем 200
  });

  // 15. Ошибка при обновлении задачи с некорректными данными
  test("15. PUT /todos/{id} should return 400 for invalid data", async ({ request }) => {
    const todo = {
      doneStatus: "invalid",
    };
    const response = await request.put(`${URL}todos/1`, {
      headers: {
        "x-challenger": token,
      },
      data: todo,
    });
    expect(response.status()).toBe(400);
  });
 // 16. PUT /todos/{id} should return 400 for invalid creation attempt
 test('16. PUT /todos/{id} should return 400 for invalid creation attempt', async ({ request }) => {
    const todo = {
      doneStatus: true,
      description: "New invalid todo"
    };
    const response = await request.put(`${URL}todos/invalid`, {
      headers: {
        'x-challenger': token,
      },
      data: todo,
    });
    expect(response.status()).toBe(400);
  });

  // 17. POST /todos/{id} should return 200 for successful update
  test('17. POST /todos/{id} should return 200 for successful update', async ({ request }) => {
    const todo = {
      title: 'Updated title',
      description: 'Updated description',
      doneStatus: false,
    };
    const response = await request.post(`${URL}todos/1`, {
      headers: {
        'x-challenger': token,
      },
      data: todo,
    });
    expect(response.status()).toBe(200);
  });

  // 18. POST /todos/{id} should return 404 for non-existent todo
  test('18. POST /todos/{id} should return 404 for non-existent todo', async ({ request }) => {
    const todo = {
      title: 'Non-existent todo',
      description: 'Trying to update non-existent',
      doneStatus: true,
    };
    const response = await request.post(`${URL}todos/9999`, {
      headers: {
        'x-challenger': token,
      },
      data: todo,
    });
    expect(response.status()).toBe(404);
  });

  // 19. PUT /todos/{id} should return 200 for full update with complete payload
  test('19. PUT /todos/{id} full update should return 200', async ({ request }) => {
    const todo = {
      title: 'Updated full title',
      description: 'Updated full description',
      doneStatus: true,
    };
    const response = await request.put(`${URL}todos/1`, {
      headers: {
        'x-challenger': token,
      },
      data: todo,
    });
    expect(response.status()).toBe(200);
  });

  // 20. PUT /todos/{id} should return 200 for partial update with just title
  test('20. PUT /todos/{id} partial update should return 200', async ({ request }) => {
    const todo = {
      title: 'Partially updated title',
    };
    const response = await request.put(`${URL}todos/1`, {
      headers: {
        'x-challenger': token,
      },
      data: todo,
    });
    expect(response.status()).toBe(200);
  });

  // 21. PUT /todos/{id} should return 400 if title is missing
  test('21. PUT /todos/{id} should return 400 if title is missing', async ({ request }) => {
    const todo = {
      description: 'This is a todo without a title',
    };
    const response = await request.put(`${URL}todos/1`, {
      headers: {
        'x-challenger': token,
      },
      data: todo,
    });
    expect(response.status()).toBe(400);
  });

  // 22. PUT /todos/{id} should return 400 for mismatching ID in payload
  test('22. PUT /todos/{id} should return 400 for mismatching ID in payload', async ({ request }) => {
    const todo = {
      id: 2, // Mismatch
      title: 'Title mismatch',
      description: 'Mismatching ID in payload',
    };
    const response = await request.put(`${URL}todos/1`, {
      headers: {
        'x-challenger': token,
      },
      data: todo,
    });
    expect(response.status()).toBe(400);
  });

  // 23. DELETE /todos/{id} should return 200 for successful deletion
  test('23. DELETE /todos/{id} should return 200 for successful deletion', async ({ request }) => {
    const response = await request.delete(`${URL}todos/1`, {
      headers: {
        'x-challenger': token,
      },
    });
    expect(response.status()).toBe(200);
  });

  // 24. OPTIONS /todos should return 200 and list allowed methods
  test('24. OPTIONS /todos should return 200 and list allowed methods', async ({ request }) => {
    const response = await request.fetch(`${URL}todos`, {
        method: 'OPTIONS',
        headers: {
            'x-challenger': token,
        },
    });
    expect(response.status()).toBe(200);
});

  // 25. GET /todos should return 200 with Accept header set to application/xml
  test('25. GET /todos should return 200 with Accept header set to application/xml', async ({ request }) => {
    const response = await request.get(`${URL}todos`, {
      headers: {
        'x-challenger': token,
        'Accept': 'application/xml',
      },
    });
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/xml');
  });

  // 26. GET /todos should return 200 with Accept header set to application/json
  test('26. GET /todos should return 200 with Accept header set to application/json', async ({ request }) => {
    const response = await request.get(`${URL}todos`, {
      headers: {
        'x-challenger': token,
        'Accept': 'application/json',
      },
    });
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
  });

  // 27. GET /todos should return 200 with Accept header set to */* (default JSON)
  test('27. GET /todos should return 200 with Accept header set to */*', async ({ request }) => {
    const response = await request.get(`${URL}todos`, {
      headers: {
        'x-challenger': token,
        'Accept': '*/*',
      },
    });
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
  });

  // 28. GET /todos should return 200 with XML preferred in Accept header
  test('28. GET /todos should return 200 with XML preferred in Accept header', async ({ request }) => {
    const response = await request.get(`${URL}todos`, {
      headers: {
        'x-challenger': token,
        'Accept': 'application/xml, application/json',
      },
    });
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/xml');
  });

  // 29. GET /todos should return 200 with no Accept header, defaulting to JSON
  test('29. GET /todos should return 200 with no Accept header, defaulting to JSON', async ({ request }) => {
    const response = await request.get(`${URL}todos`, {
      headers: {
        'x-challenger': token,
      },
    });
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
  });

  // 30. GET /todos should return 406 when Accept header is set to unsupported type
  test('30. GET /todos should return 406 when Accept header is set to unsupported type', async ({ request }) => {
    const response = await request.get(`${URL}todos`, {
      headers: {
        'x-challenger': token,
        'Accept': 'application/gzip',
      },
    });
    expect(response.status()).toBe(406);
  });

 // 31. POST /todos with XML Content-Type
test('31. POST /todos with XML Content-Type', async ({ request }) => {
    const todo = '<todo><title>Test title</title><description>Test description</description><doneStatus>false</doneStatus></todo>';
    const response = await request.post(`${URL}todos`, {
        headers: {
            'Content-Type': 'application/xml',
            'x-challenger': token,
        },
        data: todo,
    });
    expect(response.status()).toBe(201); // Если ожидается 201, убедитесь, что все данные корректны
});

// 32. POST /todos with JSON Content-Type
test('32. POST /todos with JSON Content-Type', async ({ request }) => {
    const todo = { title: "Test title", description: "Test description", doneStatus: false };
    const response = await request.post(`${URL}todos`, {
        headers: {
            'Content-Type': 'application/json',
            'x-challenger': token,
        },
        data: JSON.stringify(todo),
    });
    expect(response.status()).toBe(201); // Проверьте данные задачи
});

// 33. POST /todos with unsupported Content-Type
test('33. POST /todos with unsupported Content-Type', async ({ request }) => {
    const todo = "unsupported data format";
    const response = await request.post(`${URL}todos`, {
        headers: {
            'Content-Type': 'application/unsupported',
            'x-challenger': token,
        },
        data: todo,
    });
    expect(response.status()).toBe(415); // Убедитесь, что сервер правильно реагирует
});

// 34. GET /challenger/guid (existing X-CHALLENGER)
// 34. GET /challenger/guid (existing X-CHALLENGER)
test("34. GET /challenger/guid (existing X-CHALLENGER)", async ({ request }) => {
    const guid = token;  // Используем актуальный GUID
    const response = await request.get(`${URL}/challenger/${guid}`, {
      headers: { 'X-CHALLENGER': guid },
    });
    expect(response.status()).toBe(200); // Ожидаем успешный ответ 200
  });

// 35. PUT /challenger/guid RESTORE
test('35. PUT /challenger/guid RESTORE', async ({ request }) => {
    const guid = 'existing-guid';  // Replace with actual GUID
    const response = await request.put(`/challenger/${guid}`, {
        headers: { 'X-CHALLENGER': guid },
        data: {}
    });
    expect(response.status()).toBe(200);
});

// 36. PUT /challenger/guid CREATE
test('36. PUT /challenger/guid CREATE', async ({ request }) => {
    const guid = 'non-existing-guid';  // Replace with new GUID
    const response = await request.put(`/challenger/${guid}`, {
        data: {}
    });
    expect(response.status()).toBe(200);
});

// 37. GET /challenger/database/guid (200)
test('37. GET /challenger/database/guid (200)', async ({ request }) => {
    const guid = 'existing-guid';  // Replace with actual GUID
    const response = await request.get(`/challenger/database/${guid}`);
    expect(response.status()).toBe(200);
});

// 38. PUT /challenger/database/guid (Update)
test('38. PUT /challenger/database/guid (Update)', async ({ request }) => {
    const guid = 'existing-guid';  // Replace with actual GUID
    const data = { todos: [] };  // Adjust payload as needed
    const response = await request.put(`/challenger/database/${guid}`, {
        data
    });
    expect(response.status()).toBe(200);
});

// 39. POST /todos XML to JSON
test('39. POST /todos XML to JSON', async ({ request }) => {
    const todo = '<todo><title>Test title</title><description>Test description</description><doneStatus>false</doneStatus></todo>';
    const response = await request.post(`${URL}todos`, {
        headers: {
            'Content-Type': 'application/xml',
            'Accept': 'application/json',
            'x-challenger': token,
        },
        data: todo,
    });
    expect(response.status()).toBe(201); // Проверка создания задачи
});

// 40. POST /todos JSON to XML
test('40. POST /todos JSON to XML', async ({ request }) => {
    const todo = { title: "Test title", description: "Test description", doneStatus: false };
    const response = await request.post(`${URL}todos`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/xml',
            'x-challenger': token,
        },
        data: JSON.stringify(todo),
    });
    expect(response.status()).toBe(201); // Проверка создания задачи с XML
});

// 41. DELETE /heartbeat should return 405
test("41. DELETE /heartbeat should return 405", async ({ request }) => {
    const response = await request.delete(`${URL}/heartbeat`);
    expect(response.status()).toBe(405); // Исправлено ожидание статуса 405
  });

  // 42. PATCH /heartbeat should return 500
  test("42. PATCH /heartbeat should return 500", async ({ request }) => {
    const response = await request.patch(`${URL}/heartbeat`, { data: {} });
    expect(response.status()).toBe(500); // Сервер должен возвращать ошибку 500
  });

  // 43. TRACE /heartbeat should return 501
  test("43. TRACE /heartbeat should return 501", async ({ request }) => {
    const response = await request.fetch(`${URL}/heartbeat`, {
      method: 'TRACE',
    });
    expect(response.status()).toBe(501); // Ожидаем статус 501 для не реализованного метода
  });

  // 44. GET /heartbeat should return 204
  test("44. GET /heartbeat should return 204", async ({ request }) => {
    const response = await request.get(`${URL}/heartbeat`);
    expect(response.status()).toBe(204); // Исправлено ожидание статуса 204
  });

// 45. POST /heartbeat as DELETE (405)
test('45. POST /heartbeat as DELETE should return 405', async ({ request }) => {
    const response = await request.post(`${URL}heartbeat`, {
      method: 'DELETE',
    });
    expect(response.status()).toBe(405); // Метод DELETE не поддерживается
  });

  test("46. POST /heartbeat as PATCH should return 500", async ({ request }) => {
    const response = await request.post(`${URL}heartbeat`, {
      method: 'PATCH',
    });
    expect(response.status()).toBe(500); // Сервер должен возвращать 500 для PATCH
  });
 
  // 47. POST /heartbeat as TRACE should return 501
  test("47. POST /heartbeat as TRACE should return 501", async ({ request }) => {
    const response = await request.post(`${URL}heartbeat`, {
      method: 'TRACE',
    });
    expect(response.status()).toBe(501); // Сервер должен возвращать 501 для TRACE
  });
   
  // 48. POST /secret/token (401)
  test('48. POST /secret/token should return 401 for invalid credentials', async ({ request }) => {
    const response = await request.post(`${URL}secret/token`, {
      headers: { 'Authorization': 'Basic ' + Buffer.from('user:wrongpassword').toString('base64') },
    });
    expect(response.status()).toBe(401);
  });

  test("49. POST /secret/token should return 201 for correct credentials", async ({ request }) => {
    const response = await request.post(`${URL}secret/token`, {
      headers: { 'Authorization': 'Basic ' + Buffer.from('admin:password').toString('base64') },
    });
    expect(response.status()).toBe(201); // Убедиться, что учетные данные корректны
  });
   
  // 50. GET /secret/note should return 403 for invalid token
  test("50. GET /secret/note should return 403 for invalid token", async ({ request }) => {
    const response = await request.get(`${URL}secret/note`, {
      headers: { 'X-AUTH-TOKEN': 'invalid-token' },
    });
    expect(response.status()).toBe(403); // Ожидаем 403 для неправильного токена
  });
 
  // 51. GET /secret/note should return 401 without token
  test("51. GET /secret/note should return 401 without token", async ({ request }) => {
    const response = await request.get(`${URL}/secret/note`);
    expect(response.status()).toBe(401); // Отсутствие токена должно вернуть 401
  });

// 52. GET /secret/note (200)
test('52. GET /secret/note should return 200 for valid token', async ({ request }) => {
    const response = await request.get(`/secret/note`, {
        headers: {
            'X-AUTH-TOKEN': 'valid-token',
        },
    });
    expect(response.status()).toBe(200); // Токен действителен
});

// 53. POST /secret/note (200)
test('53. POST /secret/note should return 200 for valid note and token', async ({ request }) => {
    const response = await request.post(`/secret/note`, {
        headers: {
            'X-AUTH-TOKEN': 'valid-token',
        },
        data: {
            note: 'my note',
        },
    });
    expect(response.status()).toBe(200); // Успешная запись заметки
});

// 54. POST /secret/note should return 401 without token
  test("54. POST /secret/note should return 401 without token", async ({ request }) => {
    const response = await request.post(`${URL}/secret/note`, {
      data: { note: "my note" },
    });
    expect(response.status()).toBe(401); // Без токена должен быть статус 401
  });

  test("55. POST /secret/note should return 403 for invalid token", async ({ request }) => {
    const response = await request.post(`${URL}/secret/note`, {
      headers: { 'X-AUTH-TOKEN': 'invalid-token' },
      data: { note: "my note" },
    });
    expect(response.status()).toBe(403); // Неверный токен должен вернуть 403
  });
 
  // 56. GET /secret/note should return 200 with valid Bearer token
  test("56. GET /secret/note should return 200 with valid Bearer token", async ({ request }) => {
    const response = await request.get(`${URL}secret/note`, {
      headers: { 'Authorization': 'Bearer valid-token' },
    });
    expect(response.status()).toBe(200); // Ожидаем успешный ответ с Bearer токеном
  });
   
// 57. POST /secret/note with Bearer token (200)
test('57. POST /secret/note should return 200 with valid Bearer token', async ({ request }) => {
    const response = await request.post(`/secret/note`, {
        headers: {
            'Authorization': 'Bearer valid-token',
        },
        data: {
            note: 'my note',
        },
    });
    expect(response.status()).toBe(200); // Успешное создание заметки с Bearer токеном
});

// 58. DELETE /todos/{id} (200)
test('58. DELETE /todos/{id} should return 200 for successful deletion', async ({ request }) => {
    const response = await request.delete(`/todos/1`);
    expect(response.status()).toBe(200); // Успешное удаление последней задачи
});

// 59. POST /todos maximum (201)
const max_todos = 100; // Задайте максимальное количество задач
test("59. POST /todos should return 201 until maximum number of todos is reached", async ({ request }) => {
  for (let i = 0; i < max_todos; i++) {
    const response = await request.post(`${URL}/todos`, {
      data: {
        title: `Todo ${i}`,
        doneStatus: false,
      },
    });
    expect(response.status()).toBe(201); // Ожидаем успешное создание задач до достижения лимита
  }
});

});

