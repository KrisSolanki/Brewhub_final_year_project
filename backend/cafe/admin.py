from django.contrib import admin
from .models import *
from django.utils import timezone
# Register your models here.
# class CafeAdmin(admin.ModelAdmin):
#     list_display=("CafeID","CafeName","Description","email","mobile_no","Delivery","Take_away","is_verified","verification_status","verification_documents","LogoImage","status","cafe_managerid","address")
#     fieldsets = [
#         ('Cafe Information',{"fields":("cafe_managerid","CafeName","Description","email","mobile_no","LogoImage","address","status")}),
#         ('Type of Order',{"fields":("Delivery","Take_away")}),
#         ('Verification Information',{"fields":("verification_documents","verification_status","is_verified")}),
#     ]
# def days_since_joined(Cafe):#show diff between date_of_creation and today 
#         diff=timezone.now() - Cafe.created_at
#         return diff.days

# class CafeAdmin(admin.ModelAdmin):
#     def get_queryset(self, request):
#         # Get the queryset for the Cafe model
#         queryset = super().get_queryset(request)
#         # If the user is a Cafe Manager, filter the queryset based on their ID
#         if request.user.groups.filter(name='Cafe Manager').exists():
#             queryset = queryset.filter(cafe_managerid=request.user)
#         return queryset

# class CafeAdmin(admin.ModelAdmin):
#     def get_queryset(self, request):
#         # Get the queryset for the Cafe model
#         queryset = super().get_queryset(request)
#         # If the user is a Cafe Manager, filter the queryset based on their ID
#         print(request.user.groups.values_list('name', flat=True))
#         if request.user.groups.filter(name='Cafe Manager').exists():
#             queryset = queryset.filter(cafe_managerid=request.user)
#         return queryset

class CafeAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        # Get the queryset for the Cafe model
        queryset = super().get_queryset(request)
        # If the user is a Cafe Manager, filter the queryset based on their ID
        if request.user.groups.filter(name='Cafe Manager').exists():
            queryset = queryset.filter(cafe_managerid=request.user)
        return queryset

# Register the Cafe model with the custom admin class
admin.site.register(Cafe, CafeAdmin)



# Register the Cafe model with the custom admin class
# admin.site.register(Cafe, CafeAdmin)


class MenuAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        if request.user.groups.filter(name='Cafe Manager').exists():
            queryset = queryset.filter(cafe__cafe_managerid=request.user)
        return queryset

# Register the Menu model with the custom admin class
admin.site.register(Menu, MenuAdmin)

# admin.site.register(Cafe,CafeAdmin)
# admin.site.register(Menu)
admin.site.register(Category)
admin.site.register(SubCategory)