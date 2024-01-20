from django.db import models
from account.models import *
# Create your models here.
class Cafe(models.Model):
    CafeID = models.AutoField(primary_key=True)
    CafeName = models.CharField(max_length=30,null=False)
    Description = models.TextField(blank=True)
    email = models.EmailField(max_length=30)
    mobile_no = models.CharField(max_length=12)
    Delivery = models.BooleanField(default=False)
    Take_away = models.BooleanField(default=False)
    submission_date = models.DateTimeField(auto_now_add=True,blank=True,null=True)
    is_verified = models.BooleanField(default=False)
    verification_status = models.CharField(max_length=50,choices = [('pending','Pending'),('approved','Approved'),('rejected','Rejected')],blank=True,null=True)
    verification_documents = models.FileField(upload_to='verification_documents/',blank=True,null=True)
    LogoImage = models.ImageField(upload_to='cafe_logoimages/',blank=True,null=True)
    status = models.ForeignKey(Status,on_delete=models.CASCADE,null=True)
    cafe_managerid = models.ForeignKey(User,on_delete=models.CASCADE,null=True)
    address = models.ForeignKey(Address,on_delete=models.CASCADE,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.CafeName

class Category(models.Model):
    CategoryID=models.AutoField(primary_key=True)
    CategoryName=models.CharField(max_length=30)

    def __str__(self):
        return self.CategoryName

class Menu(models.Model):
    ItemID = models.AutoField(primary_key=True)
    ItemName = models.CharField(max_length=30)
    ItemDescription = models.TextField(blank=True)
    ItemSize = models.CharField(max_length=6,null=True,blank=True)
    ItemWeight = models.DecimalField(max_digits=6, decimal_places=2)
    ItemPrice = models.DecimalField(max_digits=6,decimal_places=2,default=0)
    ItemImage = models.ImageField(upload_to='item_images/',blank=True,null=True)
    category = models.ForeignKey(Category,on_delete=models.CASCADE)
    cafe = models.ForeignKey(Cafe,on_delete=models.CASCADE)
    status = models.ForeignKey(Status,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.ItemName 
    
class SubCategory(models.Model):
    SubCategoryID = models.AutoField(primary_key=True)
    SubCategoryName = models.CharField(max_length=30)
    category=models.ForeignKey(Category,on_delete=models.CASCADE)

    def __str__(self):
        return self.SubCategoryName
