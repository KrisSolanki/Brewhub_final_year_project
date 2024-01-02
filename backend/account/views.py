#from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer
from .models import User
# Create your views here.

class RegisterView(APIView):
    def post(self,request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class LoginView(APIView): #login feature
    def post(self,request):
        mobile_no = request.data['mobile_no']
        #email = request.data['email']
        password = request.data['password']

        user = User.objects.filter(mobile_no=mobile_no).first()#finding user
       # user = User.objects.filter(email=email).first()#finding user 

        if user is None:
            raise AuthenticationFailed('User not found!')
        
        if not user.check_password(password): #password check
            raise AuthenticationFailed('Incorrect password!')
        
        return Response({
            'message':'Success'
        })