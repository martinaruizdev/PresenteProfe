from django.conf import settings
from django.db import models
from .clases import Clase

class Encuesta(models.Model):
    ESTADO = (("ABIERTA", "Abierta"), ("CERRADA", "Cerrada"))
    clase = models.ForeignKey(Clase, on_delete=models.CASCADE,
related_name='encuestas')
    pregunta = models.CharField(max_length=240)
    estado = models.CharField(max_length=8, choices=ESTADO,
default="ABIERTA")
    creada_por = models.ForeignKey(settings.AUTH_USER_MODEL,
on_delete=models.CASCADE)
    creada_en = models.DateTimeField(auto_now_add=True)

class Opcion(models.Model):
    encuesta = models.ForeignKey(Encuesta, on_delete=models.CASCADE,
related_name='opciones')
    texto = models.CharField(max_length=120)

class Voto(models.Model):
    encuesta = models.ForeignKey(Encuesta, on_delete=models.CASCADE,
related_name='votos')
    opcion = models.ForeignKey(Opcion, on_delete=models.CASCADE)
    alumno = models.ForeignKey(settings.AUTH_USER_MODEL,
on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["encuesta", "alumno"],
name="uniq_voto_alumno_encuesta")
            ]
