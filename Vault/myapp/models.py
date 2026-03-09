from django.contrib.auth.models import User
from django.db import models
import uuid
import random



class UserProfile(models.Model):

    ## test database entry
    ##User.objects.create_user(username="testuser", password="12345")

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    phone_number = models.CharField(max_length=15)

    address = models.TextField()

    date_of_birth = models.DateField()

    def __str__(self):
        return self.user.username
    

def generate_account_number():
    return str(random.randint(1000000000, 9999999999))


class BankAccount(models.Model):

    ACCOUNT_TYPES = [
        ("STANDARD", "Standard Account"),
        ("SAVINGS", "Savings Account"),
        ("BUSINESS", "Business Account"),
    ]

    account_number = models.CharField(max_length=20, unique=True, default=generate_account_number)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPES)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.account_number} - {self.user.username}"
    

class Transaction(models.Model):

    TRANSACTION_TYPES = [
        ('deposit', 'Deposit'),
        ('withdrawal', 'Withdrawal'),
        ('transfer', 'Transfer'),
    ]

    from_account = models.ForeignKey(
        'BankAccount',
        on_delete=models.CASCADE,
        related_name='outgoing_transactions',
        null=True,
        blank=True
    )

    to_account = models.ForeignKey(
        'BankAccount',
        on_delete=models.CASCADE,
        related_name='incoming_transactions',
        null=True,
        blank=True
    )

    transaction_type = models.CharField(
        max_length=20,
        choices=TRANSACTION_TYPES
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_type} - {self.amount}"
    

class Loan(models.Model):

    LOAN_STATUS = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    loan_amount = models.DecimalField(max_digits=10, decimal_places=2)

    interest_rate = models.FloatField()

    status = models.CharField(max_length=20, choices=LOAN_STATUS)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Loan {self.loan_amount} - {self.status}"