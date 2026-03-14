from django.contrib.auth.models import User
from django.db import models
import uuid
import random
from django.utils import timezone



class UserProfile(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    profile_picture = models.ImageField(
        upload_to="myapp/assets/images/profile_pictures/",
        default="myapp/assets/images/profile_pictures/default.svg"
    )

    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

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