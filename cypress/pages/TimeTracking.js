class TimeTracking {
  constructor() {
    this.issueDetailsModal = '[data-testid="modal:issue-details"]';
    this.timeTrackingIcon = '[data-testid="icon:stopwatch"]';
    this.noTimeLogged = "No time logged";
    this.inputPlaceholderNumber = 'input[placeholder="Number"]';
    this.closeIssueModalWindow = '[data-testid="icon:close"]';
    this.timeTrackingModal = '[data-testid="modal:tracking"]';
    this.buttonDone = "Done";
  }

  addEstimatedTime(estimatedTime) {
    cy.get(this.issueDetailsModal).within(() => {
      cy.contains(this.noTimeLogged).should("exist");
      cy.get(this.inputPlaceholderNumber).type(estimatedTime).wait(1000);
    });
  }

  checkEstimatedTimeWasAdded(issueListBacklog, title, estimatedTime) {
    cy.get(this.closeIssueModalWindow).eq(0).click();
    cy.get(issueListBacklog).should("be.visible").contains(title).click();
    cy.get(this.issueDetailsModal).within(() => {
      cy.get(this.inputPlaceholderNumber).should("have.value", estimatedTime);
    });
  }

  editEstimatedTime(newEstimatedTime) {
    cy.get(this.inputPlaceholderNumber)
      .clear()
      .type(newEstimatedTime)
      .wait(1000);
  }

  checkEditedEstimatedTimeWasAdded(issueListBacklog, title, newEstimatedTime) {
    cy.get(this.closeIssueModalWindow).eq(0).click();
    cy.get(issueListBacklog).should("be.visible").contains(title).click();
    cy.get(this.issueDetailsModal).within(() => {
      cy.get(this.inputPlaceholderNumber).should(
        "have.value",
        newEstimatedTime
      );
    });
  }

  removingEstimatedTime() {
    cy.get(this.inputPlaceholderNumber).clear().wait(1000);
  }

  checkEstimatedTimeWasRemoved(issueListBacklog, title) {
    cy.get(this.closeIssueModalWindow).eq(0).click();
    cy.get(issueListBacklog).should("be.visible").contains(title).click();
    cy.get(this.issueDetailsModal).within(() => {
      cy.get(this.inputPlaceholderNumber).should("exist");
    });
  }

  clickOnTimetrackingmodul() {
    cy.get(this.issueDetailsModal).within(() => {
      cy.get(this.timeTrackingIcon).click();
    });
  }

  logTime(timeLogged, remainingTime) {
    this.clickOnTimetrackingmodul();
    cy.get(this.timeTrackingModal)
      .should("be.visible")
      .within(() => {
        cy.get(this.inputPlaceholderNumber)
          .eq(0)
          .clear()
          .type(timeLogged)
          .wait(1000);
        cy.get(this.inputPlaceholderNumber)
          .eq(1)
          .clear()
          .type(remainingTime)
          .wait(1000);
        cy.contains("button", this.buttonDone).click();
      });
    cy.get(this.timeTrackingModal).should("not.exist");
  }

  checkTimeWasLogged(estimatedTime, timeLogged, timeRemaining) {
    cy.get(this.issueDetailsModal).within(() => {
      cy.contains(`${timeLogged}h logged`).should("be.visible");
      cy.contains(`${timeRemaining}h remaining`).should("be.visible");
      cy.contains(`${estimatedTime}h estimated`).should("not.exist");
    });
  }

  removeLoggedTime() {
    this.clickOnTimetrackingmodul();
    cy.get(this.timeTrackingModal)
      .should("be.visible")
      .within(() => {
        cy.get(this.inputPlaceholderNumber).eq(0).clear().wait(1000);
        cy.get(this.inputPlaceholderNumber).eq(1).clear().wait(1000);
        cy.contains("button", this.buttonDone).click();
      });
    cy.get(this.timeTrackingModal).should("not.exist");
  }

  checkLoggedTimeWasRemoved(estimatedTime, timeLogged, timeRemaining) {
    cy.get(this.issueDetailsModal).within(() => {
      cy.contains(`${timeLogged}h logged`).should("not.exist");
      cy.contains(`${timeRemaining}h remaining`).should("not.exist");
      cy.contains(`${estimatedTime}h estimated`).should("exist");
    });
  }
}
export default new TimeTracking();
