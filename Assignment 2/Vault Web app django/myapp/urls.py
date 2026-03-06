from django.urls import path

from . import views

app_name = 'myapp'
urlpatterns = [
    path('', views.index, name='index'),
    path('blogposts/', views.blogpost_list, name='blogpost_list'),
    path('blogposts/new', views.blogpost_create, name='blogpost_create'),
    path('blogposts/<int:blogpost_id>/', views.blogpost_detail, name='blogpost_detail'),
    path('blogposts/<int:blogpost_id>/edit/', views.blogpost_edit, name='blogpost_edit'),
    path('blogposts/<int:blogpost_id>/delete/', views.blogpost_delete, name='blogpost_delete'),
]