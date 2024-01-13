from django.shortcuts import render
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
# Create your views here.

class CafeListView(APIView):
    def get (self,request):
        cafes=Cafe.objects.all()
        serializers=CafeSerializer(cafes,many=True)
        return Response(serializers.data)
    
    def post(self,request):
        serializer = CafeSerializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

class MenuListView(APIView):
    def get(self,request,*args,**kwargs):
        menu_id = kwargs.get('pk')
        category =self.request.query_params.get('category')
        
        if menu_id is not None:
            item = Menu.objects.get(pk=menu_id)
            serializer=MenuSerializer(item)
            return Response(serializer.data)
        
        if category is not None:
            categories = Menu.object.filter(Category=categories)
            serializer = MenuSerializer(categories)
            return Response(serializer.data) 

        menus = Menu.objects.all()
        serializers=MenuSerializer(menus,many=True)
        return Response(serializers.data)

    def post(self,request):
        serializers = MenuSerializer(data = request.data)
        serializers.is_valid(raise_exception=True)
        serializers.save()
