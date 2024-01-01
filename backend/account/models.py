from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    username = None
    mobile_no = models.CharField(max_length=10,unique=True)
    email = models.CharField(max_length=50) 

    USERNAME_FIELD = 'mobile_no'
    REQUIRED_FIELDS = []