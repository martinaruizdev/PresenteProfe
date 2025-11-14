from django.conf import settings
from django.db import models

class Materia(models.Model):
    nombre = models.CharField(max_length=120)
    descripcion = models.TextField(blank=True, null=True)
    docente = models.ForeignKey(settings.AUTH_USER_MODEL,
on_delete=models.CASCADE, related_name='materias')
    cantidad_alumnos = models.PositiveIntegerField(default=30)
    
    def __str__(self):
        return f"{self.nombre}"