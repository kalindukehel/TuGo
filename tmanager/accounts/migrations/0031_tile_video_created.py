# Generated by Django 3.1.4 on 2021-03-02 19:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0030_tile_video_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='tile',
            name='video_created',
            field=models.DateTimeField(blank=True, default=None, null=True),
        ),
    ]
