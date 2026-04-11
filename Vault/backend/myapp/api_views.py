from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction, IntegrityError
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework.permissions import AllowAny
from .models import BankAccount, Transaction, Loan, UserProfile
from .serializers import (
    BankAccountSerializer, 
    TransactionSerializer, 
    LoanSerializer, 
    UserProfileSerializer,
    UserSerializer
)
from decimal import Decimal

User = get_user_model()

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class BankAccountViewSet(viewsets.ModelViewSet):
    serializer_class = BankAccountSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return BankAccount.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        accounts = BankAccount.objects.filter(user=self.request.user)
        return Transaction.objects.filter(
            from_account__in=accounts
        ) | Transaction.objects.filter(
            to_account__in=accounts
        ).order_by('-created_at')

class LoanViewSet(viewsets.ModelViewSet):
    serializer_class = LoanSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Loan.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.status != 'PENDING' and not request.user.is_staff:
            return Response({"error": "Only pending loans can be deleted."}, status=status.HTTP_400_BAD_REQUEST)
        return super().destroy(request, *args, **kwargs)

class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if '@' in username:
            try:
                user_obj = User.objects.get(email=username)
                username = user_obj.username
            except User.DoesNotExist:
                return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({"success": "Logged in", "user": UserSerializer(user).data})
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutAPIView(APIView):
    def post(self, request):
        logout(request)
        return Response({"success": "Logged out"})

class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')

        if not username or not password or not email:
            return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                user = User.objects.create_user(
                    username=username, 
                    email=email, 
                    password=password,
                    first_name=first_name,
                    last_name=last_name
                )
                BankAccount.objects.create(user=user, account_type='STANDARD', balance=0)
                UserProfile.objects.get_or_create(user=user)
                
                login(request, user)
                return Response({"success": "User registered", "user": UserSerializer(user).data}, status=status.HTTP_201_CREATED)
        except IntegrityError:
            return Response({"error": "Username or Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

class CSRFTokenView(APIView):
    permission_classes = [AllowAny]
    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        return Response({"success": "CSRF cookie set"})

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

class TransferAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        from_account_id = request.data.get('from_account')
        to_account_number = request.data.get('to_account')
        amount = Decimal(request.data.get('amount', 0))
        description = request.data.get('description', '')

        if amount <= 0:
            return Response({"error": "Amount must be greater than zero."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            from_account = BankAccount.objects.get(id=from_account_id, user=request.user)
        except BankAccount.DoesNotExist:
            return Response({"error": "Source account not found or unauthorized."}, status=status.HTTP_404_NOT_FOUND)

        try:
            to_account = BankAccount.objects.get(account_number=to_account_number)
        except BankAccount.DoesNotExist:
            return Response({"error": "Recipient account not found."}, status=status.HTTP_404_NOT_FOUND)

        if from_account.balance < amount:
            return Response({"error": "Insufficient balance."}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            from_account = BankAccount.objects.select_for_update().get(id=from_account_id)
            to_account = BankAccount.objects.select_for_update().get(account_number=to_account_number)

            from_account.balance -= amount
            to_account.balance += amount

            from_account.save()
            to_account.save()

            Transaction.objects.create(
                from_account=from_account,
                to_account=to_account,
                amount=amount,
                description=description,
                transaction_type="transfer"
            )

        return Response({"message": "Transfer successful."}, status=status.HTTP_201_CREATED)
