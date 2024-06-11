import IssueModal from "../pages/IssueModal.js";
const comment = "TEST_COMMENT";
const previousComment = "An old silent pond...";
const newComment = "TEST_COMMENT_EDITED";

describe("Issue comments creating, editing and deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("Should create a comment successfully", () => {
    IssueModal.addNewComment(comment);
    IssueModal.assertNewCommentIsAdded(comment);
  });

  it("Should edit a comment successfully", () => {
    IssueModal.editComment(previousComment, newComment);
    IssueModal.assertCommentIsUpdated(newComment);
  });

  it("Should delete a comment successfully", () => {
    IssueModal.deleteComment(newComment);
    IssueModal.assertCommentIsDeleted(newComment);
  });
});
