describe('Homepage E2E', () => {
  it('should load the homepage and contain the title', () => {
    cy.visit('http://localhost:3000');
    cy.contains('자연이 주는 온전한 치유');
  });
});
