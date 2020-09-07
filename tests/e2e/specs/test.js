// https://docs.cypress.io/api/introduction/api.html

describe("My First Test", () => {
  it("Visits the app root url", () => {
    cy.visit("http://localhost:8080/");
    cy.contains("#valor_em_conta", "Valor em Conta");
    cy.contains("#depositos", "Depósitos");
    cy.contains("#resgates", "Resgates");
    cy.contains("#pagamentos", "Pagamentos");
  });
});
