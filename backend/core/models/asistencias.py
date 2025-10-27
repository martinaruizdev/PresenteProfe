from django.conf import settings
from django.db import models
from .clases import Clase

class Asistencia(models.Model):
    METODO = (("QR", "QR"), ("MANUAL", "Manual"))
    clase = models.ForeignKey(Clase, on_delete=models.CASCADE,
related_name='asistencias')
    alumno = models.ForeignKey(settings.AUTH_USER_MODEL,
on_delete=models.CASCADE)
    metodo = models.CharField(max_length=6, choices=METODO, default="QR")
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        constraints = [
        models.UniqueConstraint(fields=["clase", "alumno"],
        name="uniq_asistencia_alumno_clase")
        ]