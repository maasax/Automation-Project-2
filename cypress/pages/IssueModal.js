class IssueModal {
  constructor() {
    this.submitButton = 'button[type="submit"]';
    this.issueModal = '[data-testid="modal:issue-create"]';
    this.issueDetailModal = '[data-testid="modal:issue-details"]';
    this.title = 'input[name="title"]';
    this.issueType = '[data-testid="select:type"]';
    this.descriptionField = ".ql-editor";
    this.assignee = '[data-testid="select:userIds"]';
    this.backlogList = '[data-testid="board-list:backlog"]';
    this.issuesList = '[data-testid="list-issue"]';
    this.deleteButton = '[data-testid="icon:trash"]';
    this.deleteButtonName = "Delete issue";
    this.cancelDeletionButtonName = "Cancel";
    this.confirmationPopup = '[data-testid="modal:confirm"]';
    this.closeDetailModalButton = '[data-testid="icon:close"]';

    this.issueCommentsList = '[data-testid="issue-comment"]';
    this.addCommentField = "Add a comment...";
    this.commentTextAreaPlaceholder =
      'textarea[placeholder="Add a comment..."]';
    this.saveCommentButton = "Save";
    this.editCommentButton = "Edit";
    this.deleteCommentButton = "Delete";
    this.commentDeletionConfirmationModal = '[data-testid="modal:confirm"]';
    this.confirmCommentDeleteButton = "Delete comment";
  }

  getIssueModal() {
    return cy.get(this.issueModal);
  }

  getIssueDetailModal() {
    return cy.get(this.issueDetailModal);
  }

  selectIssueType(issueType) {
    cy.get(this.issueType).click("bottomRight");
    cy.get(`[data-testid="select-option:${issueType}"]`)
      .trigger("mouseover")
      .trigger("click");
  }

  selectAssignee(assigneeName) {
    cy.get(this.assignee).click("bottomRight");
    cy.get(`[data-testid="select-option:${assigneeName}"]`).click();
  }

  editTitle(title) {
    cy.get(this.title).debounced("type", title);
  }

  editDescription(description) {
    cy.get(this.descriptionField).type(description);
  }

  createIssue(issueDetails) {
    this.getIssueModal().within(() => {
      this.selectIssueType(issueDetails.type);
      this.editDescription(issueDetails.description);
      this.editTitle(issueDetails.title);
      this.selectAssignee(issueDetails.assignee);
      cy.get(this.submitButton).click();
    });
  }

  ensureIssueIsCreated(expectedAmountIssues, issueDetails) {
    cy.get(this.issueModal).should("not.exist");
    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");

    cy.get(this.backlogList)
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        cy.get(this.issuesList)
          .should("have.length", expectedAmountIssues)
          .first()
          .find("p")
          .contains(issueDetails.title);
        cy.get(`[data-testid="avatar:${issueDetails.assignee}"]`).should(
          "be.visible"
        );
      });
  }

  ensureIssueIsVisibleOnBoard(issueTitle) {
    cy.get(this.issueDetailModal).should("not.exist");
    cy.reload();
    cy.contains(issueTitle).should("be.visible");
  }

  ensureIssueIsNotVisibleOnBoard(issueTitle) {
    cy.get(this.issueDetailModal).should("not.exist");
    cy.reload();
    cy.contains(issueTitle).should("not.exist");
  }

  validateAmountOfIssuesInBacklog(amountOfIssues) {
    cy.get('[data-testid="board-list:backlog"]').within(() => {
      cy.get('[data-testid="list-issue"]').should(
        "have.length",
        amountOfIssues
      );
    });
  }

  clickDeleteButton() {
    cy.get(this.deleteButton).click();
    cy.get(this.confirmationPopup).should("be.visible");
  }

  confirmDeletion() {
    cy.get(this.confirmationPopup).within(() => {
      cy.contains("Are you sure you want to delete this issue?").should(
        "be.visible"
      );
      cy.contains("Once you delete, it's gone for good").should("be.visible");
      cy.contains(this.deleteButtonName).click();
    });
    cy.get(this.confirmationPopup).should("not.exist");
    cy.get(this.backlogList).should("be.visible");
  }

  cancelDeletion() {
    cy.get(this.confirmationPopup).within(() => {
      cy.contains("Are you sure you want to delete this issue?").should(
        "be.visible"
      );
      cy.contains("Once you delete, it's gone for good").should("be.visible");
      cy.contains(this.cancelDeletionButtonName).click();
    });
    cy.get(this.confirmationPopup).should("not.exist");
    cy.get(this.issueDetailModal).should("be.visible");
  }

  closeDetailModal() {
    cy.get(this.issueDetailModal)
      .get(this.closeDetailModalButton)
      .first()
      .click();
    cy.get(this.issueDetailModal).should("not.exist");
  }

  getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');

  addNewComment(comment) {
    this.getIssueDetailsModal().within(() => {
      cy.contains(this.addCommentField).click();

      cy.get(this.commentTextAreaPlaceholder).type(comment);

      cy.contains("button", this.saveCommentButton).click().should("not.exist");
    });
  }

  assertNewCommentIsAdded(comment) {
    cy.contains(this.addCommentField).should("exist");
    cy.get(this.issueCommentsList).should("contain", comment);
  }

  editComment(previousComment, newComment) {
    this.getIssueDetailsModal().within(() => {
      cy.get(this.issueCommentsList)
        .first()
        .contains(this.editCommentButton)
        .click()
        .should("not.exist");

      cy.get(this.commentTextAreaPlaceholder)
        .should("contain", previousComment)
        .clear()
        .type(newComment);

      cy.contains("button", this.saveCommentButton).click().should("not.exist");
    });
  }

  assertCommentIsUpdated(newComment) {
    cy.get(this.issueCommentsList)
      .should("contain", this.editCommentButton)
      .and("contain", newComment);
  }

  deleteComment(newComment) {
    this.getIssueDetailsModal()
      .find(this.issueCommentsList)
      .contains(this.deleteCommentButton)
      .click();

    cy.get(this.commentDeletionConfirmationModal)
      .contains("button", this.confirmCommentDeleteButton)
      .click()
      .should("not.exist");
  }

  assertCommentIsDeleted(newComment) {
    this.getIssueDetailsModal().find(this.issuesList).should("not.exist");
  }
}

export default new IssueModal();
