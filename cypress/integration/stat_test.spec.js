const localAddress = Cypress.env('statBase');

for (let i = 0; i < 10; i++) {
  describe(`statistics functionality test::iteration ${i + 1}`, () => {
    it('navigate1', () => {
      cy.visit(localAddress);
      cy.contains('Table');
    });
    it('should render statistics', () => {
      cy.get('.rt-table').first().children().contains(/^\d+$/);
    });
  });
}
