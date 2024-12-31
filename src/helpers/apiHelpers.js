import { faker } from '@faker-js/faker'; // Импорт faker

// Изменяем протокол с http на https
export const BASE_URL = "https://apichallenges.herokuapp.com/";

// Функция для создания Todo
export const createTodo = async (request, url, token, todoData) => {
    try {
        const response = await request.post(`${url}todos`, {
            headers: {
                "x-challenger": token,
                "Content-Type": "application/json",
            },
            data: todoData,
        });
        if (!response.ok()) {
            console.error(`Failed to create todo: ${response.status()} - ${response.statusText()}`);
        }
        return response;
    } catch (error) {
        console.error("Error in createTodo:", error);
        throw error;
    }
};

// Генерация длинной строки
export const generateLongString = (length) => {
    return 'x'.repeat(length);
};

// Генерация данных для Todo
export const generateTodoData = () => ({
    title: faker.lorem.words(2),
    description: faker.lorem.sentence(),
    doneStatus: faker.datatype.boolean(),
});

// Значение по умолчанию для Todo
export const defaultTodo = {
    title: "Test todo",
    description: "Test description",
    doneStatus: false,
};

// Получение токена авторизации
export const getAuthToken = async (request, token, useBearer = false) => {
    try {
        const headers = {
            "Content-Type": "application/json",
        };

        if (useBearer) {
            headers.Authorization = `Bearer ${token}`;
        } else {
            headers["X-CHALLENGER"] = token;
        }

        const response = await request.post(`${BASE_URL}secret/token`, {
            headers: headers,
        });

        if (response.status() === 201) {
            const authToken = (await response.headers()).get("x-auth-token");
            return authToken;
        } else {
            console.error("Auth token request failed:", {
                status: response.status(),
                statusText: response.statusText(),
            });
            return null;
        }
    } catch (error) {
        console.error("Error getting auth token:", error);
        throw error;
    }
};

// Операции с заметками
export const secretNoteOperations = {
    create: async (request, authToken, noteData, useBearer = false) => {
        try {
            const headers = {
                "Content-Type": "application/json",
            };

            if (useBearer) {
                headers.Authorization = `Bearer ${authToken}`;
            } else {
                headers["X-Auth-Token"] = authToken;
            }

            const response = await request.post(`${BASE_URL}secret/note`, {
                headers: headers,
                data: noteData || generateNoteData(),
            });

            if (!response.ok()) {
                console.error(`Failed to create secret note: ${response.status()} - ${response.statusText()}`);
            }
            return response;
        } catch (error) {
            console.error("Error in createSecretNote:", error);
            throw error;
        }
    },

    get: async (request, authToken, useBearer = false) => {
        try {
            const headers = {
                "Content-Type": "application/json",
            };

            if (useBearer) {
                headers.Authorization = `Bearer ${authToken}`;
            } else {
                headers["X-Auth-Token"] = authToken;
            }

            const response = await request.get(`${BASE_URL}secret/note`, {
                headers: headers,
            });

            if (!response.ok()) {
                console.error(`Failed to get secret note: ${response.status()} - ${response.statusText()}`);
            }
            return response;
        } catch (error) {
            console.error("Error in getSecretNote:", error);
            throw error;
        }
    },
};

// Генерация данных для заметки
export const generateNoteData = () => ({
    note: faker.lorem.paragraph(),
});
