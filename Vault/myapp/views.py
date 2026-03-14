import logging
import random

from django.http import HttpRequest
from django.shortcuts import  render, redirect
from django.utils import timezone

from myapp.models import BankAccount, Transaction
from .models import Transaction, BankAccount, UserProfile
from django.db import transaction
from .forms import RegisterForm
from django.contrib.auth import authenticate, login
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.contrib.auth.models import User
from decimal import Decimal


logger = logging.getLogger(__name__)


def index(request: HttpRequest):
    context = {}
    return render(request, 'myapp/index.html', context)

def home(request):
    return render(request, 'myapp/index.html')


@login_required
def dashboard(request):

    accounts = BankAccount.objects.filter(user=request.user)

    total_accounts = accounts.count()

    total_balance = sum(account.balance for account in accounts)

    savings_balance = sum(
        account.balance for account in accounts if account.account_type == "SAVINGS"
    )

    transactions = Transaction.objects.filter(
        from_account__in=accounts
    ) | Transaction.objects.filter(
        to_account__in=accounts
    )

    transactions = transactions.order_by("-created_at")[:5]

    context = {
        "transactions": transactions,
        "accounts": accounts,
        "total_accounts": total_accounts,
        "total_balance": total_balance,
        "savings_balance": savings_balance,
    }

    return render(request, "myapp/dashboard.html", context)



def login_view(request):

    if request.method == "POST":

        email = request.POST.get("email")
        password = request.POST.get("password")

        try:
            user_obj = User.objects.get(email=email)
            username = user_obj.username
        except User.DoesNotExist:
            username = None

        user = authenticate(request, username=username, password=password)
        print("Email and password recieved")
        print(email,username, password)
        print(user)

        if user is not None:
            print("User is not none")
            login(request, user)
            print("User authenticated")
            return redirect("/dashboard/")
        else:
            messages.error(request, "Invalid email or password")
            print("Invalid email or password")

    return render(request, "myapp/loginPage.html")


def logout_view(request):
    logout(request)
    return redirect("/login/")

@login_required
def accounts(request):

    accounts = BankAccount.objects.filter(user=request.user)

    context = {
        "accounts": accounts
    }

    return render(request, "myapp/accounts.html", context)

def create_account(request):

    if request.method == "POST":

        account_type = request.POST.get("account_type")

        account_number = str(random.randint(1000000000, 9999999999))

        BankAccount.objects.create(
            user=request.user,
            account_type=account_type,
            account_number=account_number,
            balance=0
        )

        return redirect("/accounts/")

    return redirect("/accounts/")

@login_required
def loans(request):
    return render(request, 'myapp/loans.html')


@login_required
def transactions(request):

    accounts = BankAccount.objects.filter(user=request.user)

    transactions = Transaction.objects.filter(
        from_account__in=accounts
    ) | Transaction.objects.filter(
        to_account__in=accounts
    )

    transactions = transactions.order_by("created_at")

    return render(
        request,
        "myapp/transaction.html",
        {"transactions": transactions}
    )


@login_required
def transfer(request):
    if request.method == "POST":

        from_account_id = request.POST.get("from_account")
        print("FROM ACCOUNT ID:", from_account_id)
        to_account_number = request.POST.get("to_account")
        amount = Decimal(request.POST.get("amount"))
        description = request.POST.get("reference")

        from_account = BankAccount.objects.get(id=from_account_id)
        #to_account = BankAccount.objects.get(account_number=to_account_number)

        # SECURITY CHECK
        if from_account.user != request.user:
            messages.error(request, "Unauthorized account access")
            return redirect("/transfer/")

        try:
            to_account = BankAccount.objects.get(account_number=to_account_number)
        except BankAccount.DoesNotExist:
            messages.error(request, "Recipient account not found")
            return redirect("/transfer/")

        if from_account.balance < amount:
            messages.error(request, "Insufficient balance")
            return redirect("/transfer/")

        with transaction.atomic():

            from_account = BankAccount.objects.select_for_update().get(id=from_account_id)
            to_account = BankAccount.objects.select_for_update().get(account_number=to_account_number)

            from_account.balance = from_account.balance - amount
            to_account.balance = to_account.balance + amount

            from_account.save()
            to_account.save()

            Transaction.objects.create(
                from_account=from_account,
                to_account=to_account,
                amount=amount,
                description=description,
                transaction_type="TRANSFER"
            )

        return redirect("/dashboard/")

    accounts = BankAccount.objects.filter(user=request.user)

    return render(request, "myapp/transfer.html", {"accounts": accounts})


def register(request):

    if request.method == "POST":
        print("POST received")

        form = RegisterForm(request.POST)

        if form.is_valid():

            user = form.save(commit=False)

            user.set_password(form.cleaned_data['password'])

            user.save()
            print("USER SAVED")

            ## Create a default bank account for the new user
            BankAccount.objects.create(
            user=user,
            account_type="STANDARD",
            balance=0
    )
            print("USER AND BANK ACCOUNT CREATED")

            return redirect('/login/')
        
        else:
            print(form.errors)

    else:
        form = RegisterForm()

    return render(request, "myapp/register.html", {"form": form})


@login_required
def profile(request):

    profile, created = UserProfile.objects.get_or_create(user=request.user)

    account = BankAccount.objects.filter(user=request.user).first()

    context = {
        "profile": profile,
        "account": account
    }

    return render(request, "myapp/profile.html", context)

@login_required
def edit_profile(request):

    profile = request.user.userprofile

    if request.method == "POST":

        request.user.first_name = request.POST.get("first_name")
        request.user.last_name = request.POST.get("last_name")
        request.user.email = request.POST.get("email")

        profile.phone = request.POST.get("phone")
        profile.address = request.POST.get("address")

        if "profile_picture" in request.FILES:
            profile.profile_picture = request.FILES["profile_picture"]

        request.user.save()
        profile.save()

        return redirect("/profile/")

    return render(request, "myapp/edit_profile.html", {
        "profile": profile
    })







