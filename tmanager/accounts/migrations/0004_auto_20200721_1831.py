# Generated by Django 3.0.8 on 2020-07-21 22:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_auto_20200721_1925'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='profile_picture',
            field=models.ImageField(default='tmanager\\media\\default.jpg', upload_to='profile_pictures'),
        ),
    ]