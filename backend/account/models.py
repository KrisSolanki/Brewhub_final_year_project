from django.db import models
from django.contrib.auth.models import AbstractUser,BaseUserManager

# Create your models here.
class CustomUserManager(BaseUserManager):
    def create_user(self, mobile_no, password=None, **extra_fields):
        if not mobile_no:
            raise ValueError('The mobile number must be set')
        user = self.model(mobile_no=mobile_no, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, mobile_no, password=None, **extra_fields):
        # Ensure the user is created as a superuser
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(mobile_no, password, **extra_fields)
    
class User(AbstractUser):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    username = None
    mobile_no = models.CharField(max_length=10,unique=True)
    password = models.CharField(max_length=100)
    email = models.CharField(max_length=50,blank=True,null=True) 

    USERNAME_FIELD = 'mobile_no'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()
    def __str__(self):
        return self.mobile_no