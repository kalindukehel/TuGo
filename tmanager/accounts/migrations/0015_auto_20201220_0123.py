# Generated by Django 3.1.2 on 2020-12-20 01:23

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0014_auto_20201204_0142'),
    ]

    operations = [
        migrations.AddField(
            model_name='like',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='post',
            name='soundcloud_search_query',
            field=models.CharField(default='null', max_length=100),
            preserve_default=False,
        ),
    ]