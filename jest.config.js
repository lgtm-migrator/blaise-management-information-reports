process.env = Object.assign(process.env, {
    PROJECT_ID: "mock-project-id",
    BERT_URL: "mock-bert-url"
});

module.exports = {
  moduleNameMapper: {
    "\\.(css)$": "<rootDir>/__mocks__/styleMock.js",
  }
};

