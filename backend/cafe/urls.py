from django.urls import path,include
from .views import *
urlpatterns = [

    path('cafelist/',CafeListView.as_view(),name='cafe-list'),
    path('cafelist/<int:pk>/',CafeListView.as_view(),name='cafe-list'),

    path('menulist/',MenuListView.as_view(),name='menu-list'),

]

from django.conf.urls.static import static
from django.conf import settings
if settings.DEBUG:
    urlpatterns += static(settings.LOGO_MEDIA_URL,document_root=settings.LOGO_MEDIA_ROOT)
    urlpatterns += static(settings.ITEM_MEDIA_URL,document_root=settings.ITEM_MEDIA_ROOT)