# Generated by Django 3.0.8 on 2021-01-04 02:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0019_activity_item_follower'),
    ]

    operations = [
        migrations.AddField(
            model_name='feed_item',
            name='follow_relation',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='+', to='accounts.Follower'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='feed_item',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='feed_item',
            name='post',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='+', to='accounts.Post'),
        ),
    ]