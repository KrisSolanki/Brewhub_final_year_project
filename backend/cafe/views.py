from django.shortcuts import render
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
# Create your views here.
from django.db.models import Q

class CafeListView(APIView):
    def get(self, request, *args, **kwargs):
        cafe_id = kwargs.get('pk')
        q = request.query_params.get('q', '')
        print(f"Query: {q}")

        if cafe_id is not None:
            cafes = Cafe.objects.get(pk=cafe_id)
            serializer = CafeSerializer(cafes)
            return Response(serializer.data)

        cafe_result = Cafe.objects.filter(
            Q(CafeName__icontains=q) | 
            Q(Description__icontains=q)
        )
        print(f"Cafe Results: {cafe_result}") 

        # Correctly serialize the cafe_result queryset
        serializer = CafeSerializer(cafe_result, many=True)
        return Response(serializer.data)
    
    def post(self,request):
        serializer = CafeSerializer(data = request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class MenuListView(APIView):
    def get(self,request,*args,**kwargs):
        menu_id = kwargs.get('pk')
        category =self.request.query_params.get('category')
        search_query = request.query_params.get('q')

        if menu_id is not None:
            item = Menu.objects.get(pk=menu_id)
            serializer=MenuSerializer(item)
            return Response(serializer.data)
        
        if category is not None:
            categories = Menu.object.filter(Category=categories)
            serializer = MenuSerializer(categories)
            return Response(serializer.data) 

        if search_query is not None:
            items = Menu.objects.filter(ItemName__icontains=search_query)
            serializer = MenuSerializer(items, many=True)
            return Response(serializer.data)

        menus = Menu.objects.all()
        serializers=MenuSerializer(menus,many=True)
        return Response(serializers.data)

    def post(self,request):
        serializers = MenuSerializer(data = request.data)
        serializers.is_valid(raise_exception=True)
        serializers.save()
        return Response(serializers.data)

class CategoryView(APIView):
    def post(self,request):
        serializers=CategorySerializer(data = request.data)
        serializers.is_valid(raise_exception=True)
        serializers.save()
        return Response(serializers.data)

    def get(self,request,*args,**kwargs):
        category_id = kwargs.get('pk')
        if category_id is not None:
            categories = Category.objects.get(pk=category_id)
            serializer=CategorySerializer(categories)
            return Response(serializer.data)

        category_obj=Category.objects.all()
        serializers=CategorySerializer(category_obj,many=True)
        return Response(serializers.data)


class SubCategoryView(APIView):
    def post(self,request):
        serializers=SubCategoryView(data = request.data)
        serializers.is_valid(raise_exception=True)
        serializers.save()
        return Response(serializers.data)
    
    def get(self,request,*args,**kwargs):
        subcategory_id= kwargs.get('pk')

        if subcategory_id is not None:
            subcategories = SubCategory.objects.get(pk=subcategory_id)
            serializer=SubCategorySerializer(subcategories)
            return Response(serializer.data)
        
        subcategory_obj=SubCategory.objects.all()
        serializers=SubCategorySerializer(subcategory_obj)
        return Response(serializers.data)
    