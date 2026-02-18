// 1. Definimos los mocks ANTES de cualquier otra cosa
const mockSend = jest.fn();
const mockPutCommand = jest.fn((args) => args);

// 2. Mockeamos el SDK completo
jest.mock("@aws-sdk/client-dynamodb", () => ({
  DynamoDBClient: jest.fn().mockImplementation(() => ({
    send: mockSend,
  })),
}));

jest.mock("@aws-sdk/lib-dynamodb", () => ({
  DynamoDBDocumentClient: {
    from: jest.fn().mockImplementation(() => ({
      send: mockSend,
    })),
  },
  PutCommand: mockPutCommand,
}));

describe("Auth Lambda Handler", () => {
  const mockEvent = {
    request: {
      userAttributes: {
        sub: "user-123",
        email: "test@example.com",
        name: "Uriel Capistran",
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.TABLE_NAME = "blog-website-table";
    // Forzamos que el require obtenga una versión fresca si es posible
    jest.resetModules();
  });

  test("should successfully sync user data to DynamoDB", async () => {
    mockSend.mockResolvedValueOnce({});

    // Importamos la función aquí
    const { handler } = require("./index");

    await handler(mockEvent);

    // Verificamos que PutCommand fue instanciado
    expect(mockPutCommand).toHaveBeenCalled();

    // Verificamos que el cliente envió el comando
    expect(mockSend).toHaveBeenCalledWith(expect.anything());
  });

  test("should catch and log errors", async () => {
    mockSend.mockRejectedValueOnce(new Error("DynamoDB Down"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const { handler } = require("./index");
    await handler(mockEvent);

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
