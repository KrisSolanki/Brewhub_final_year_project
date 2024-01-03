# Generated by Django 5.0 on 2024-01-03 18:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0009_user_is_verified'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='is_verified',
            new_name='is_mobile_verified',
        ),
        migrations.RemoveField(
            model_name='user',
            name='is_admin',
        ),
        migrations.AddField(
            model_name='user',
            name='otp',
            field=models.CharField(default='', max_length=6),
        ),
    ]
