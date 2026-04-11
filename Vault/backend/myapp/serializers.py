from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, BankAccount, Transaction, Loan

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'profile_picture', 'phone', 'address', 'date_of_birth', 'created_at']

class BankAccountSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    account_type_display = serializers.CharField(source='get_account_type_display', read_only=True)

    class Meta:
        model = BankAccount
        fields = ['id', 'user', 'account_number', 'account_type', 'account_type_display', 'balance', 'created_at']
        read_only_fields = ['account_number', 'balance', 'created_at']

class TransactionSerializer(serializers.ModelSerializer):
    from_account_number = serializers.CharField(source='from_account.account_number', read_only=True, allow_null=True)
    to_account_number = serializers.CharField(source='to_account.account_number', read_only=True, allow_null=True)
    transaction_type_display = serializers.CharField(source='get_transaction_type_display', read_only=True)

    class Meta:
        model = Transaction
        fields = ['id', 'from_account', 'from_account_number', 'to_account', 'to_account_number', 'transaction_type', 'transaction_type_display', 'amount', 'description', 'created_at']

class LoanSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    loan_type_display = serializers.CharField(source='get_loan_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Loan
        fields = ['id', 'user', 'amount', 'loan_type', 'loan_type_display', 'duration_months', 'status', 'status_display', 'created_at']
        read_only_fields = ['status', 'created_at']
