#-------- created for otp (2factor) api ---------- date:3/01/2024
from django.core.mail import send_mail
import requests
import random
from django.conf import settings

def send_otp_to_email(email):
    try:
        # Generate a random 4-digit OTP
        otp = random.randint(1000, 9999)

        # Email subject and message
        subject = 'Your OTP Code'
        message = f'Your OTP is {otp}. Please use this to complete your verification.'

        # Send email using Django's send_mail function
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,  # Raise exceptions for any issues
        )

        # Return OTP for verification purposes (store it securely)
        return otp
    except Exception as e:
        print(f"Error sending OTP to email: {str(e)}")
        return None


from twilio.rest import Client

account_sid = settings.TWILIO_ACCOUNT_SID
auth_token = settings.TWILIO_AUTH_TOKEN
client = Client(account_sid,auth_token)

def send_sms(mobile_no):
    
    try:
        otp1=random.randint(1000,9999)
        return otp1
    except Exception as e:
        return None 
    


