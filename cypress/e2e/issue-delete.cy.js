const issueTitle = "This is an issue of type: Task.";
const modalConfirm = '[data-testid="modal:confirm"]';
describe("Issue deletion", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains(issueTitle).click();
        cy.get('[data-testid="modal:issue-details"]').should("exist");
      });
  });

  it("Should delete an issue and validate it successfully", () => {
    //Deleting the issue
    cy.get('[data-testid="icon:trash"]').click();
    cy.get(modalConfirm).should("be.visible");
    cy.get(modalConfirm).within(() => {
      cy.contains("Delete issue").click();
    });
    //Asserting the issue is deleted
    cy.get(modalConfirm).should("not.exist");
    cy.get('[data-testid="modal:issue-details"]').should("not.exist");
    cy.get('[data-testid="board-list:backlog"]').within(() => {
      cy.contains(issueTitle).should("not.exist");
      cy.get('[data-testid="list-issue"]').should("have.length", 3);
    });
  });

  it("Should cancel issue deletion and assert the issue still exists", () => {
    //Cancelling deletion process
    cy.get('[data-testid="icon:trash"]').click();
    cy.get(modalConfirm).should("be.visible");
    cy.get(modalConfirm).within(() => {
      cy.contains("Cancel").click();
    });

    //Asserting the cancelling deletion process was successful
    cy.get(modalConfirm).should("not.exist");
    cy.get('[data-testid="modal:issue-details"]').should("exist");
    cy.get('[data-testid="icon:close"]').eq(0).click();
    cy.get('[data-testid="board-list:backlog"]').within(() => {
      cy.contains(issueTitle).should("exist");
      cy.get('[data-testid="list-issue"]').should("have.length", 4);
    });
  });
});
