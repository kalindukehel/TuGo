# Generated by Django 3.1.4 on 2021-04-13 02:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0040_auto_20210413_0224'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tile',
            name='youtube_video_url',
            field=models.CharField(blank=True, default='', max_length=11, null=True),
        ),
    ]
