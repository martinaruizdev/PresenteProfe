from django.db import models
from .materias import Materia

class Clase(models.Model):
    materia = models.ForeignKey(Materia, on_delete=models.CASCADE,
related_name='clases')
    fecha = models.DateTimeField()
    creada_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Clase {self.id} - {self.materia.nombre} ({self.fecha:%Y-%m-%d %H:%M})"

        