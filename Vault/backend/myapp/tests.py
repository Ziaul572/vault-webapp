from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from .models import BankAccount, Loan, Transaction, UserProfile
from decimal import Decimal

class VaultAPITests(APITestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username='testuser', password='testpassword', email='test@example.com')
        self.client.login(username='testuser', password='testpassword')
        
        # Create a test staff user
        self.staff_user = User.objects.create_user(username='staffuser', password='staffpassword', is_staff=True)
        
        # Create an initial account for testing
        self.account = BankAccount.objects.create(
            user=self.user,
            account_type='STANDARD',
            balance=Decimal('1000.00'),
            account_number='1234567890'
        )

    def test_list_accounts(self):
        """Q2: GET /api/accounts/ Fetches a list of all accounts for the user"""
        url = reverse('account-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['account_number'], '1234567890')

    def test_create_account(self):
        """Q2: POST /api/accounts/ Creates a new account"""
        url = reverse('account-list')
        data = {'account_type': 'SAVINGS'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(BankAccount.objects.filter(user=self.user).count(), 2)

    def test_list_transactions(self):
        """Q2: GET /api/transactions/ Fetches user transactions"""
        Transaction.objects.create(to_account=self.account, amount=100.00, transaction_type='deposit')
        url = reverse('transaction-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_transfer_funds_success(self):
        """Q2: POST /api/transfer/ Perform fund transfer (Write operation with auth)"""
        recipient_account = BankAccount.objects.create(
            user=self.staff_user,
            account_type='STANDARD',
            balance=100.00,
            account_number='0987654321'
        )
        url = reverse('transfer-api')
        data = {
            'from_account': self.account.id,
            'to_account': '0987654321',
            'amount': 500.00,
            'description': 'Test Transfer'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        self.account.refresh_from_db()
        recipient_account.refresh_from_db()
        self.assertEqual(self.account.balance, Decimal('500.00'))
        self.assertEqual(recipient_account.balance, Decimal('600.00'))

    def test_apply_loan(self):
        """Q2: POST /api/loans/ Apply for a loan"""
        url = reverse('loan-list')
        data = {'amount': 5000, 'loan_type': 'PERSONAL', 'duration_months': 12}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Loan.objects.filter(user=self.user).count(), 1)

    def test_delete_loan_permission(self):
        """Q2: Row-level / Staff check. Staff can delete, and owner can delete if PENDING."""
        loan = Loan.objects.create(user=self.user, amount=1000, loan_type='PERSONAL', duration_months=12, status='PENDING')
        url = reverse('loan-detail', kwargs={'pk': loan.id})
        
        # Test owner can delete pending loan
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Re-create and test staff check
        loan = Loan.objects.create(user=self.user, amount=1000, loan_type='PERSONAL', duration_months=12, status='APPROVED')
        url = reverse('loan-detail', kwargs={'pk': loan.id})
        
        # Owner cannot delete approved loan
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Staff can delete anything
        self.client.login(username='staffuser', password='staffpassword')
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_update_profile(self):
        """Q2: PUT /api/profile/ Update user profile"""
        url = reverse('profile-api')
        data = {
            'user': {'first_name': 'NewName', 'last_name': 'NewLast', 'email': 'new@test.com'},
            'phone': '123456789'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'NewName')
        
    def test_unauthenticated_access(self):
        """Q2: All write operations must verify user is logged in"""
        self.client.logout()
        url = reverse('account-list')
        response = self.client.post(url, {'account_type': 'SAVINGS'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)