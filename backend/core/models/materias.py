from django.conf import settings
from django.db import models

class Materia(models.Model):
    nombre = models.CharField(max_length=120)
    docente = models.ForeignKey(settings.AUTH_USER_MODEL,
on_delete=models.CASCADE, related_name='materias')
    
    def __str__(self):
        return f"{self.nombre}"