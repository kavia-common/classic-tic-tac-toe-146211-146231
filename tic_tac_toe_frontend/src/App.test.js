import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders status indicator and can play a move', () => {
  render(<App />);
  const status = screen.getByRole('status');
  expect(status).toBeInTheDocument();

  // click first square
  const squares = screen.getAllByRole('button', { name: /Square/i });
  fireEvent.click(squares[0]);

  // status should now indicate O's turn after X plays
  expect(status.textContent).toMatch(/Turn: O|wins|draw/i);
});
