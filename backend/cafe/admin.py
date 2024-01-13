from django.contrib import admin
from .models import *
from django.utils import timezone
# Register your models here.
class CafeAdmin(admin.ModelAdmin):
    list_display=("CafeID","CafeName","Description","email","mobile_no","Delivery","Take_away","is_verified","verification_status","verification_documents","LogoImage","status","cafe_managerid","address")
    fieldsets = [
        ('Cafe Information',{"fields":("cafe_managerid","CafeName","Description","email","mobile_no","LogoImage","address","status")}),
        ('Type of Order',{"fields":("Delivery","Take_away")}),
        ('Verification Information',{"fields":("verification_documents","verification_status","is_verified")}),
    ]
# def days_since_joined(Cafe):#show diff between date_of_creation and today 
#         diff=timezone.now() - Cafe.created_at
#         return diff.days


admin.site.register(Cafe,CafeAdmin)
admin.site.register(Menu)
admin.site.register(Category)
admin.site.register(SubCategory)