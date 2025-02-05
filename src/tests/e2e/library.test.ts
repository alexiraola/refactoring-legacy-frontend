
describe('Library App', () => {
  const title = 'Irrelevant book title';
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('should display the correct title', () => {
    cy.contains('h1', 'LIBRARY APP');
  });

  it('should not show any book at start', () => {
    cy.get('[data-testid="books"]')
      .should('be.empty');
  });

  it('should add a book', () => {
    addBook(title, 'https://example.com/image.jpg');

    cy.get('[data-testid="book"]').should('exist');

    removeBook();
  });

  it('should remove a book', () => {
    addBook(title, 'https://example.com/image.jpg');

    cy.get('[data-testid="book"]').should('exist');

    removeBook();
    cy.get('[data-testid="book"]').should('not.exist');
  });

  it('should mark a book as read', () => {
    addBook(title, 'https://example.com/image.jpg');

    cy.get('[data-testid="markAsRead"]').click();
    cy.get('[data-testid="book"]')
      .get('[data-testid="completed"]')
      .should('exist');

    removeBook();
  });

  it('should filter books by read', () => {
    addBook('Book 1', 'https://example.com/image.jpg');
    cy.get('[data-testid="markAsRead"]').click();
    addBook('Book 2', 'https://example.com/image.jpg');

    cy.get('[data-testid="book"]').should('have.length', 2);
    cy.get('[data-testid="showReadBooks"]').click();
    cy.get('[data-testid="book"]').should('have.length', 1);

    removeBook();
    cy.get('[data-testid="showAllBooks"]').click();
    removeBook();
  });

  it('should filter books by unread', () => {
    addBook('Book 1', 'https://example.com/image.jpg');
    cy.get('[data-testid="markAsRead"]').click();
    addBook('Book 2', 'https://example.com/image.jpg');

    cy.get('[data-testid="book"]').should('have.length', 2);
    cy.get('[data-testid="showUnreadBooks"]').click();
    cy.get('[data-testid="book"]').should('have.length', 1);

    removeBook();
    cy.get('[data-testid="showAllBooks"]').click();
    removeBook();
  });

  it('should edit a book', () => {
    addBook('Book 1', 'https://example.com/image.jpg');

    const newTitle = 'Changed book';
    editBook(newTitle, 'https://example.com/image.jpg');

    cy.get('[data-testid="book"]').contains(newTitle);

    removeBook();
  });
});

function addBook(title: string, cover: string) {
    cy.get('[data-testid="title"]').type(title);
    cy.get('[data-testid="cover"]').type(cover);
    cy.get('[data-testid="add"]').click();
}

function editBook(title: string, cover: string) {
    cy.get('[data-testid="edit"]').click();
    cy.get('[data-testid="editTitle"]').type(title);
    cy.get('[data-testid="editCover"]').type(cover);
    cy.get('[data-testid="saveEdit"]').click();
}

function removeBook() {
    cy.get('[data-testid="delete"]').click();
}
