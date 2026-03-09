import logging

from django.http import HttpRequest
from django.shortcuts import  render, redirect
from django.utils import timezone

from myapp.models import BankAccount
from .forms import RegisterForm
from django.contrib.auth import authenticate, login
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User



logger = logging.getLogger(__name__)


def index(request: HttpRequest):
    context = {}
    return render(request, 'myapp/index.html', context)

def home(request):
    return render(request, 'myapp/index.html')


@login_required
def dashboard(request):
    return render(request, "myapp/dashboard.html")

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

def accounts(request):
    return render(request, 'myapp/accounts.html')

def loans(request):
    return render(request, 'myapp/loans.html')

def transactions(request):
    return render(request, 'myapp/transaction.html')

def transfer(request):
    return render(request, "myapp/transfer.html")


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

def profile(request):
    return render(request, "myapp/profile.html")







