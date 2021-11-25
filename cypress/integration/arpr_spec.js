describe("run arpr for a date with no data", () => {
  //POC for talking point for cati
  //before(() => {
  //cy.visit("https://dev-jw02-cati.social-surveys.gcp.onsdigital.uk/blaise/Account/Login?ReturnUrl=%2Fblaise%2F");
  //cy.get("#Username").type("james");
  //cy.get("#Password").type("james");
  //cy.get("button[type=submit]").click();
  //cy.get(".nav").contains("Appointments").click();
  //});

  it("returns a no data found panel", () => {
    cy.visit("https://dev-jw02-reports.social-surveys.gcp.onsdigital.uk/");
    cy.get("#appointment-resource-planning").click();
    cy.get(".panel--info").eq(0).should("include.text", "Run a Daybatch first to obtain the most accurate results.");
    cy.get("#date").type("1990-06-30");
    cy.get("button[type=submit]").click();
    cy.get(".panel--info").eq(1).should("have.text", "No data found for parameters given.");
  });
});
