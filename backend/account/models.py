from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    #username = None
    mobile_no = models.CharField(max_length=10,unique=True)
    password = models.CharField(max_length=100)
    email = models.CharField(max_length=50,blank=True,null=True) 

    USERNAME_FIELD = 'mobile_no'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.mobile_no