import { faker } from "@faker-js/faker";
import TimeTracking from "../pages/TimeTracking";

const title = "Time tracking issue";
const description = faker.lorem.sentence(5);

const issueListBacklog = '[data-testid="board-list:backlog"]';
const estimatedTime = "10";
const newEstimatedTime = "20";
const timeLogged = "2";
const timeRemaining = "5";

describe("Issue comments creating, editing and deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board?modal-issue-create=true");
      });

    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get(".ql-editor").type(description);
      cy.get('input[name="title"]').type(title);
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select:userIds"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('button[type="submit"]').click();
    });

    cy.contains("Issue has been successfully created.").should("be.visible");
    cy.get(issueListBacklog).should("be.visible").contains(title).click();
  });

  it("Should add, upadate and remove time estimation", () => {
    TimeTracking.addEstimatedTime(estimatedTime);
    TimeTracking.checkEstimatedTimeWasAdded(
      issueListBacklog,
      title,
      estimatedTime
    );
    TimeTracking.editEstimatedTime(newEstimatedTime);
    TimeTracking.checkEditedEstimatedTimeWasAdded(
      issueListBacklog,
      title,
      newEstimatedTime
    );
    TimeTracking.removingEstimatedTime();
    TimeTracking.checkEstimatedTimeWasRemoved(issueListBacklog, title);
  });

  it("Should log time and remove logged time", () => {
    TimeTracking.addEstimatedTime(estimatedTime);
    TimeTracking.logTime(timeLogged, timeRemaining);
    TimeTracking.checkTimeWasLogged(estimatedTime, timeLogged, timeRemaining);
    TimeTracking.removeLoggedTime();
    TimeTracking.checkLoggedTimeWasRemoved(
      estimatedTime,
      timeLogged,
      timeRemaining
    );
  });
});
