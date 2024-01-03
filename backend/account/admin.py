from django.contrib import admin
from .models import User
from django.utils import timezone
# Register your models here.


class UserAdmin(admin.ModelAdmin):#to display fields in user panel properly 
    list_display = ("id","mobile_no","first_name","last_name","email","is_active","is_mobile_verified","days_since_joined")
    #list_display = ["id","email", "name", "is_admin"]
    fieldsets = [
        ('User Credentials', {"fields": ("email","mobile_no","otp", "password")}),
        ("Personal info", {"fields": ("first_name","last_name","dob","date_joined")}),
        ("Permissions", {"fields": ("is_active", "is_staff","is_mobile_verified")}),
    ]
    def days_since_joined(self,User):#show diff between date_of_creation and today 
        diff=timezone.now() - User.date_joined
        return diff.days
    
admin.site.register(User, UserAdmin)