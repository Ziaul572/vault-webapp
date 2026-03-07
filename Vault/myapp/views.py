import logging

from django.http import HttpRequest
from django.shortcuts import get_object_or_404, render, redirect
from django.utils import timezone

from .models import BlogPost
from .forms import NewBlogPostForm, EditBlogPostForm

logger = logging.getLogger(__name__)


def index(request: HttpRequest):
    context = {}
    return render(request, 'myapp/index.html', context)

def home(request):
    return render(request, 'myapp/index.html')

def dashboard(request):
    return render(request, "myapp/dashboard.html")

def accounts(request):
    return render(request, 'myapp/accounts.html')

def loans(request):
    return render(request, 'myapp/loans.html')

def transactions(request):
    return render(request, 'myapp/transactions.html')

def transfer(request):
    return render(request, "myapp/transfer.html")

def login(request):
    return render(request, "myapp/loginPage.html")

def register(request):
    return render(request, "myapp/register.html")







