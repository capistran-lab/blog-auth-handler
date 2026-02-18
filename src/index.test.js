const { handler } = require("./index");
const { Client } = require("pg");

// 1. Mockeamos el cliente de PostgreSQL
jest.mock("pg", () => {
  const mClient = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Client: jest.fn(() => mClient) };
});

describe("Cognito Post-Confirmation Lambda", () => {
  let client;

  beforeEach(() => {
    // Obtenemos la instancia mockeada
    client = new Client();
    jest.clearAllMocks();
    process.env.DATABASE_URL = "postgres://user:pass@localhost:5432/db";
  });

  test("Debe insertar el usuario en Neon correctamente", async () => {
    // Simulamos el evento que envía Cognito
    const event = {
      request: {
        userAttributes: {
          sub: "12345-abcde",
          email: "usuario@test.com",
        },
      },
    };

    const result = await handler(event);

    // Verificaciones de DB
    expect(client.connect).toHaveBeenCalledTimes(1);
    expect(client.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO users"),
      ["12345-abcde", "usuario@test.com"],
    );
    expect(client.end).toHaveBeenCalledTimes(1);

    // Verificación de contrato con Cognito
    expect(result).toEqual(event);
  });

  test("Debe retornar el evento incluso si la DB falla (resiliencia)", async () => {
    // Simulamos un error de conexión
    client.connect.mockRejectedValueOnce(new Error("Connection error"));

    const event = {
      request: {
        userAttributes: { sub: "123", email: "fail@test.com" },
      },
    };

    const result = await handler(event);

    // Aunque falle la DB, la Lambda debe devolver el evento para no bloquear a Cognito
    expect(result).toEqual(event);
    expect(client.end).toHaveBeenCalled();
  });

  test("Debe manejar atributos faltantes sin explotar", async () => {
    const event = {
      request: {
        userAttributes: {}, // Sin email ni sub
      },
    };

    const result = await handler(event);

    expect(client.connect).not.toHaveBeenCalled();
    expect(result).toEqual(event);
  });
});
