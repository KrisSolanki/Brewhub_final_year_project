from django.db import models
from account.models import *
from cafe.models import *

# Create your models here.

class Offer(models.Model):
    OfferID = models.AutoField(primary_key=True)
    OfferTitle = models.CharField(max_length=50,blank=True,null=True)
    OfferDescription = models.TextField(null=True,blank=True)
    MinimumAmount = models.IntegerField(null=True,blank=True)
    DiscountPercentage = models.DecimalField(max_digits=5,decimal_places=2,null=True,blank=True)
    StartDate = models.DateTimeField()
    Endtime = models.DateTimeField()   
    status = models.ForeignKey(Status,on_delete=models.CASCADE)
    
    def __str__(self):
        return self.OfferTitle

class Cart_M(models.Model):
    CartID = models.AutoField(primary_key=True)
    User_ID = models.ForeignKey(User,on_delete=models.CASCADE)
    Offer_ID=models.ForeignKey(Offer,on_delete=models.SET_NULL,null=True,blank=True)
    Total = models.DecimalField(max_digits=10,decimal_places=2,default=0)
    Subtotal = models.DecimalField(max_digits=10,decimal_places=2,default=0,editable=True)



    def __str__(self):
        return f"{self.CartID} - {self.User_ID}"    

class Cart_Details(models.Model):
    CartDetailsID = models.AutoField(primary_key=True)
    ItemQuantity = models.IntegerField()
    Subtotal = models.DecimalField(max_digits=10,decimal_places=2,default=0,editable=True)
    Item_ID = models.ForeignKey(Menu,on_delete=models.CASCADE)
    # Offer_ID=models.ForeignKey(Offer,on_delete=models.CASCADE,null=True,blank=True)
    Cart_ID = models.ForeignKey(Cart_M,on_delete=models.CASCADE)

    # class Meta:
    #     constraints = [
    #         models.UniqueConstraint(fields=['Cart_ID', 'Item_ID'], name='unique_cart_item')
    #     ]
    
    def __str__(self):
        return f"{self.Cart_ID} - {self.Item_ID} - {self.CartDetailsID}"


class Order_M(models.Model):
    OrderID = models.AutoField(primary_key=True)
    OrderDate = models.DateTimeField()
    Total = models.DecimalField(max_digits=10,decimal_places=2,null=True,blank=True)
    Review = models.TextField()
    Rating = models.IntegerField(choices = [(1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')])
    User_ID = models.ForeignKey(User,on_delete=models.CASCADE)
    Status_ID = models.ForeignKey(Status,on_delete=models.CASCADE)
    Offer_ID = models.ForeignKey(Offer,on_delete = models.SET_NULL,null=True,blank=True)
    #Payment_ID = models.ForeignKey(Payment_M,on_delete=models.CASCADE,null=True,blank=True)

    def __str__(self):
        return str(self.OrderID) 
    
class Order_Details(models.Model):
    OrderDetailsID = models.AutoField(primary_key=True)
    ItemQuantity = models.IntegerField()
    Subtotal = models.DecimalField(max_digits=10,decimal_places=2)
    Item_ID = models.ForeignKey(Menu,on_delete=models.CASCADE)
    Order_ID = models.ForeignKey(Order_M,on_delete=models.CASCADE)
    

    def __str__(self):
        return f"{self.Order_ID} - {self.Item_ID}"
    

class Complaint(models.Model):

    ComplaintID = models.AutoField(primary_key=True)
    Complaint_Description = models.TextField()
    Complaint_Date = models.DateTimeField()
    Status_ID = models.ForeignKey(Status,on_delete=models.CASCADE)
    User_ID = models.ForeignKey(User,on_delete=models.CASCADE)
    Order_ID = models.ForeignKey(Order_M,on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.ComplaintID} - {self.User_ID}"



