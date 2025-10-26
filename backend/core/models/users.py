from django.conf import settings
from django.db import models

ROLE_CHOICES = (
    ("DOCENTE", "Docente"),
    ("ALUMNO", "Alumno"),
)

class Perfil(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL,
on_delete=models.CASCADE)
    rol = models.CharField(max_length=10, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.user.username} ({self.rol})"