process.env = Object.assign(process.env, {
    PROJECT_ID: "mock-project-id",
    BERT_URL: "mock-bert-url",
    BERT_CLIENT_ID: "mock-bert-client-id"
});

module.exports = {
  moduleNameMapper: {
    "\\.(css)$": "<rootDir>/__mocks__/styleMock.js",
  }
};

