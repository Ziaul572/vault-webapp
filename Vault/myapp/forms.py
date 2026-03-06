from django import forms

from .models import BlogPost


class NewBlogPostForm(forms.Form):
    title = forms.CharField(
        max_length=200,
        widget=forms.TextInput(attrs={'class': 'example-css-class', 'placeholder': 'Enter Post Title'}),
        label='Title'
    )
    content = forms.CharField(
        widget=forms.Textarea(attrs={'class': 'example-css-class'}),
        label='Content'
    )
    image = forms.FileField(
        required=False,
        widget=forms.ClearableFileInput(attrs={'class': 'example-css-class'}),
        label='Image'
    )

    def clean_title(self):
        title = self.cleaned_data.get('title')
        if BlogPost.objects.filter(title=title).exists():
            raise forms.ValidationError('A post with this title already exists')
        return title

    def clean_content(self):
        content = self.cleaned_data.get('content')
        if 'http://' in content or 'https://' in content:
            raise forms.ValidationError('HTTP Links not allowed in content')
        return content


class EditBlogPostForm(forms.Form):
    content = forms.CharField(
        widget=forms.Textarea(attrs={'class': 'example-css-class'}),
        label='Content'
    )
    image = forms.FileField(
        required=False,
        widget=forms.ClearableFileInput(attrs={'class': 'example-css-class'}),
        label='Image'
    )

    def clean_content(self):
        content = self.cleaned_data.get('content')
        if 'http://' in content or 'https://' in content:
            raise forms.ValidationError('HTTP Links not allowed in content')
        return content