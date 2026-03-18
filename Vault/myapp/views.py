import logging
import random

from django.http import HttpRequest
from django.shortcuts import  render, redirect
from django.utils import timezone
from .models import Loan

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

    total_balance = sum(account.balance for account in accounts)            ##check accounts balance and sum them up
    savings_balance = sum(
        account.balance for account in accounts if account.account_type == "SAVINGS"
    )

    transactions = Transaction.objects.filter(
        from_account__in=accounts                                           ##transaction summary
    ) | Transaction.objects.filter(
        to_account__in=accounts
    )

    transactions = transactions.order_by("-created_at")[:5]

    pending_loans = Loan.objects.filter(                                    ##loan pending summary
        user=request.user,
        status="PENDING"
    )

    context = {
        "transactions": transactions,
        "accounts": accounts,
        "total_accounts": total_accounts,
        "total_balance": total_balance,
        "savings_balance": savings_balance,
        "pending_loans": pending_loans
    }

    return render(request, "myapp/dashboard.html", context)



def login_view(request):
                                                                        ##login logic for authentication using email instead of username
    if request.method == "POST":

        email = request.POST.get("email")
        password = request.POST.get("password")

        try:
            user_obj = User.objects.get(email=email)
            username = user_obj.username
        except User.DoesNotExist:
            username = None                                             ##works when user is not a null value

        user = authenticate(request, username=username, password=password)          ##django's built in authentication system to authenticate user using username and password, we get the username from the email provided by the user
        print("Email and password recieved")
        print(email,username, password)
        print(user)                                                                        ##debug practice

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
    logout(request)                                                             ##logout function that clears session data and logs out the user
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

        account_type = request.POST.get("account_type")                                      ##create account logic that generates a random 10 digit account number and creates a new bank account for the user with the selected account type and an initial balance of 0

        account_number = str(random.randint(1000000000, 9999999999))

        BankAccount.objects.create(                                                            ##creates the bankAccount row in database
            user=request.user,
            account_type=account_type,
            account_number=account_number,
            balance=0
        )

        return redirect("/accounts/")

    return redirect("/accounts/")

@login_required
def loans(request):

    if request.method == "POST":

        amount = request.POST.get("amount")                                     ##creates a user request that shows loan request has been sent
        loan_type = request.POST.get("loan_type")
        duration = request.POST.get("duration")

        Loan.objects.create(
            user=request.user,
            amount=amount,
            loan_type=loan_type,
            duration_months=duration
        )

        return redirect("myapp:loans")

    loans = Loan.objects.filter(user=request.user)

    return render(request, "myapp/loans.html", {"loans": loans})

@login_required
def deposit(request):

    if request.method == "POST":

        account_id = request.POST.get("account")
        amount = Decimal(request.POST.get("amount"))                                ##basic way for adding funds to the account, it checks if the account belongs to the user and then adds the amount to the account balance and creates a transaction record for the deposit

        account = BankAccount.objects.get(id=account_id)

        if account.user != request.user:
            return redirect("myapp:dashboard")

        account.balance += amount
        account.save()

        Transaction.objects.create(
            to_account=account,
            amount=amount,
            transaction_type="DEPOSIT"
        )

        return redirect("myapp:dashboard")

    accounts = BankAccount.objects.filter(user=request.user)

    return render(request, "myapp/deposit.html", {"accounts": accounts})


@login_required
def withdraw(request):

    if request.method == "POST":

        account_id = request.POST.get("account")
        amount = Decimal(request.POST.get("amount"))

        account = BankAccount.objects.get(id=account_id)                        ##basic withdraw logic

        if account.balance < amount:
            return redirect("myapp:withdraw")

        account.balance -= amount
        account.save()

        Transaction.objects.create(
            from_account=account,                                               ##creates a transaction log
            amount=amount,
            transaction_type="WITHDRAW"
        )

        return redirect("myapp:dashboard")

    accounts = BankAccount.objects.filter(user=request.user)

    return render(request, "myapp/withdraw.html", {"accounts": accounts})

@login_required
def transactions(request):

    accounts = BankAccount.objects.filter(user=request.user)

    transactions = Transaction.objects.filter(                  ##transaction logic that retrieves all transactions where the user is either the sender or the recipient, and orders them by creation date
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
        description = request.POST.get("reference")                     ##user can transfers funds between accounts, it checks if the from account belongs to the user, if the to account exists, and if the from account has sufficient balance before performing the transfer and creating a transaction record for it    

        from_account = BankAccount.objects.get(id=from_account_id)
        #to_account = BankAccount.objects.get(account_number=to_account_number)

        # SECURITY CHECK
        if from_account.user != request.user:
            messages.error(request, "Unauthorized account access")              ##security check to prevent users from transferring funds from accounts that do not belong to them
            return redirect("/transfer/")

        try:
            to_account = BankAccount.objects.get(account_number=to_account_number)
        except BankAccount.DoesNotExist:
            messages.error(request, "Recipient account not found")
            return redirect("/transfer/")

        if from_account.balance < amount:
            messages.error(request, "Insufficient balance")
            return redirect("/transfer/")

        with transaction.atomic():                              ##atomic transaction to ensure that both account updates and the transaction record creation happen together, preventing data inconsistencies in case of errors during the transfer process

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
        print("POST received")                                  ##register logic that uses a custom registration form to create a new user, sets the password, and creates a default bank account for the new user. It also includes print statements for debugging purposes to track the registration process and any potential errors that may occur during form validation or user creation.

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

    profile, created = UserProfile.objects.get_or_create(user=request.user)             ##profile view that retrieves the user's profile information and bank account details to display on the profile page. It uses get_or_create to ensure that a UserProfile instance exists for the user, and retrieves the first bank account associated with the user to show on the profile page. The context is then passed to the template for rendering.

    account = BankAccount.objects.filter(user=request.user).first()

    context = {
        "profile": profile,
        "account": account
    }

    return render(request, "myapp/profile.html", context)

@login_required
def edit_profile(request):

    profile = request.user.userprofile                  ##edit profile view that allows users to update their profile information, including their first name, last name, email, phone number, address, and profile picture. It checks if the request method is POST, and if so, it updates the user's information and saves the changes to the database. If a new profile picture is uploaded, it also updates the profile picture field in the UserProfile model. After saving the changes, it redirects the user back to the profile page. If the request method is not POST, it renders the profile edit form with the current profile information pre-filled for the user to edit.

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

    return render(request, "myapp/profileEdit.html", {
        "profile": profile
    })







