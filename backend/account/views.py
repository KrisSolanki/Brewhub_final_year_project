from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer
from .models import User
from rest_framework.decorators import api_view #----- date : 3/01/2024--------- for otp
from .otpapi import send_otp_to_mobile #---------- date : 3/01/2024--------



# Create your views here.




#===================== REGISTER ====================
class RegisterView(APIView):
    def post(self,request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)



#===================== LOGIN ====================
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



#===================== SEND OTP ====================    
#---------- date : 3/01/2024----------otp
@api_view(['POST'])
def send_otp(request):
    data = request.data

    if data.get('mobile_no') is None:   #---------if mobile_no is not received 
        return Response({
            'status':400,
            'message':'key mobile_no is required'
        })
    if data.get('password') is None:    #---------if password is not received
        return Response({
            'status':400,
            'message':'key password is required'
        })
    
    #after creating otpapi.py
  #  otp = send_otp_to_mobile(data.get('mobile_no'))

    user = User.objects.create( 
        mobile_no = data.get('mobile_no'),
        otp = send_otp_to_mobile(data.get('mobile_no'))
        )
    user.set_password = data.get('set_password')
    user.save()

    return Response({
        'status' : 200 , 'messsage' : 'Otp Sent'
    })




#===================== VERIFY OTP ====================
@api_view(['POST']) #------------------- date : 5/01/2024--------------------
def verify_otp(request):
    data = request.data

    if data.get('mobile_no') is None:   #---------if mobile_no is not received 
        return Response({
            'status':400,
            'message':'key mobile_no is required'
        })
    if data.get('otp') is None:    #---------if otp is not received
        return Response({
            'status':400,
            'message':'key otp is required'
        })
    
    try:
        user_obj = User.objects.get(mobile_no = data.get('mobile_no'))

    except Exception as e:
        return Response({
            'status' : 400,
            'message' : 'invalid mobile no '
        }) 
    if user_obj.otp == data.get('otp'):
        user_obj.is_mobile_verified = True
        user_obj.save()
        return Response({
            'status' : 200,
            'message' : 'otp matched'
        })

    return Response({
            'status' : 400,
            'message' : 'invalid otp'
        }) 




#===================== RESEND OTP ====================
@api_view(['POST'])#-------------------------date:5/01/2024 --------------------
def resend_otp(request):
    data = request.data

    if data.get('mobile_no') is None:
        return Response({
            'status': 400,
            'message': 'key mobile_no is required'
        })

    try:
        user_obj = User.objects.get(mobile_no=data.get('mobile_no'))
    except User.DoesNotExist:
        return Response({
            'status': 400,
            'message': 'Invalid mobile no'
        })

    #--------------------------------------------------------------------------------------------
    # this block of code Checks if enough time has passed since the last OTP request
    # -------------------------------------------------------------------------------------------
    # current_time = datetime.now()
    # if user_obj.last_otp_request_time:
    #     time_difference = current_time - user_obj.last_otp_request_time
    #     if time_difference < timedelta(seconds=10):
    #         return Response({
    #             'status': 400,
    #             'message': 'Wait for 10 seconds before resending OTP'
    #         })
    #---------------------------------------------------------------------------------------------
    # need to add an extra field in our user model 
    # last_otp_request_time = models.DateTimeField(null=True, blank=True)
    #---------------------------------------------------------------------------------------------

    # send_otp_to_mobile is a function that sends OTP and returns it
    otp = send_otp_to_mobile(data.get('mobile_no'))

    # Update the existing user's OTP
    user_obj.otp = otp
    user_obj.save()

    # Send the new OTP (implement your OTP sending logic here)
    # For example, you can call your existing OTP sending function

    return Response({
        'status': 200,
        'message': 'OTP Resent'
    })
