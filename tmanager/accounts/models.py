from django.db import models

# Create your models here.

class Account(models.Model):
    username = models.CharField(max_length=20, unique=True)
    email = models.EmailField(max_length=30)
    name = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)