import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('http://localhost:8000/api/profile/', () => {
    return HttpResponse.json({
      id: 1,
      user: { username: 'testuser', first_name: 'Test', last_name: 'User', email: 'test@example.com' },
      phone: '12345',
      address: 'Test Lane',
      created_at: '2026-04-10T00:00:00Z'
    });
  }),
  
  http.get('http://localhost:8000/api/accounts/', () => {
    return HttpResponse.json([
      { id: 1, account_number: '1234567890', account_type: 'STANDARD', account_type_display: 'Standard Account', balance: '1000.00' }
    ]);
  }),

  http.get('http://localhost:8000/api/transactions/', () => {
    return HttpResponse.json([
      { id: 1, transaction_type: 'deposit', amount: '500.00', created_at: '2026-04-10T00:00:00Z' }
    ]);
  }),

  http.get('http://localhost:8000/api/loans/', () => {
    return HttpResponse.json([
      { id: 1, amount: '5000', loan_type: 'PERSONAL', loan_type_display: 'Personal Loan', status: 'PENDING', status_display: 'Pending', created_at: '2026-04-10T00:00:00Z' }
    ]);
  }),
];
