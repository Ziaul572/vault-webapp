from django.db import models


class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.FileField(upload_to='myapp_upload/', null=True, blank=True)
    created = models.DateTimeField()
    last_edited = models.DateTimeField()

    def __str__(self):
        return self.title