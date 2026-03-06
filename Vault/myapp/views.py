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


def blogpost_list(request: HttpRequest):
    logger.info(f'Called blogpost_list() with {request.method}')
    blogpost_list = BlogPost.objects.all()
    context = {
        'blogpost_list': blogpost_list
    }
    return render(request, 'myapp/blogpost_list.html', context)


def blogpost_detail(request: HttpRequest, blogpost_id: int):
    blogpost = get_object_or_404(BlogPost, id=blogpost_id)
    context = {
        'blogpost': blogpost,
    }    
    return render(request, 'myapp/blogpost_detail.html', context)


def blogpost_create(request: HttpRequest):
    if request.method == 'POST':
        logger.info(f'blogpost_create(): POST data: {request.POST}')
        form = NewBlogPostForm(request.POST, request.FILES)
        if form.is_valid():
            new_blogpost = BlogPost.objects.create(
                title = form.cleaned_data['title'],
                content = form.cleaned_data['content'],
                image = form.cleaned_data['image'],
                created = timezone.now(),
                last_edited = timezone.now(),
            )
            return redirect(f'/blogposts/{new_blogpost.id}')
    else:
        form = NewBlogPostForm()
    context = {
        'new_blogpost_form': form
    }
    return render(request, 'myapp/blogpost_create.html', context)


def blogpost_edit(request: HttpRequest, blogpost_id: int):
    blogpost = get_object_or_404(BlogPost, id=blogpost_id)
    if request.method == 'POST':
        logger.info(f'blogpost_edit(): POST data: {request.POST}')
        form = EditBlogPostForm(request.POST, request.FILES)
        if form.is_valid():
            blogpost.content = form.cleaned_data['content']
            if blogpost.image and (form.cleaned_data['image'] == False or form.cleaned_data['image']):
                blogpost.image.delete()
                blogpost.image = None
            if form.cleaned_data['image']:
                blogpost.image = form.cleaned_data['image']
            blogpost.last_edited = timezone.now()
            blogpost.save()
            return redirect('myapp:blogpost_detail', blogpost.id)
    else:
        initial = {
            'content': blogpost.content,
            'image': blogpost.image
        }
        form = EditBlogPostForm(initial=initial)
    context = {
        'blogpost': blogpost,
        'edit_blogpost_form': form
    }
    return render(request, 'myapp/blogpost_edit.html', context)


def blogpost_delete(request: HttpRequest, blogpost_id: int):
    blogpost = get_object_or_404(BlogPost, id=blogpost_id)
    blogpost.delete()
    return redirect('myapp:blogpost_list')