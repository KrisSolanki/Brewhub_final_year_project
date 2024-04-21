from django.contrib import admin
from .models import *
from django.utils import timezone
# Register your models here.
# class KAdminArea(admin.AdminSite):
#     login_template = 'http://localhost:3000/login'

# kadmin=KAdminArea(name='k the king')
# kadmin.register(User, )

class StateAdmin(admin.ModelAdmin):
    list_display = ("StateID", "State")
class CityAdmin(admin.ModelAdmin):
    list_display = ("CityID", "City", "State")
    
class UserAdmin(admin.ModelAdmin):#to display fields in user panel properly 
    list_display = ("id","mobile_no","first_name","last_name","email","is_active","is_mobile_verified","days_since_joined")
    #list_display = ["id","email", "name", "is_admin"]
    fieldsets = [
        ('User Credentials', {"fields": ("email","mobile_no","otp", "password")}),
        ("Personal info", {"fields": ("first_name","last_name","dob","date_joined","Profile_Picture","Gender")}),
        ("Permissions & Roles", {"fields": ("is_active", "is_staff","is_mobile_verified","Role","Status")}),
    ]
    def days_since_joined(self,User):#show diff between date_of_creation and today 
        diff=timezone.now() - User.date_joined
        return diff.days
    
class StatusAdmin(admin.ModelAdmin):
    list_display = ("StatusID", "Status_Name")
class RoleAdmin(admin.ModelAdmin):
    list_display = ("RoleID", "Role_Name")

class AddressAdmin(admin.ModelAdmin):
    list_display = ("AddressID", "Home","Street","Landmark", "Pincode", "City", "User")


admin.site.register(User, UserAdmin)
admin.site.register(Roles,RoleAdmin)
admin.site.register(Status,StatusAdmin)
admin.site.register(State,StateAdmin)
admin.site.register(City,CityAdmin)
admin.site.register(Address,AddressAdmin)