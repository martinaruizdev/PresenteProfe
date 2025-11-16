from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone

from core.models import Clase, Asistencia
from core.qr import verify_qr_token
from api.permissions import IsAlumno


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAlumno])
def marcar_asistencia(request):
    print("Usuario:", request.user)
    print("Clase ID:", request.data.get('clase_id'))
    print("Token:", request.data.get('token'))
    print("Método:", request.data.get('metodo'))
    clase_id = request.data.get('clase_id')
    token = request.data.get('token')
    metodo = request.data.get('metodo', 'QR')

    if not clase_id:
        return Response({'detail': 'Falta clase_id.'}, status=400)

    try:
        clase = Clase.objects.get(pk=clase_id)
    except Clase.DoesNotExist:
        return Response({'detail': 'Clase no encontrada.'}, status=404)

    # Verificar token si es QR
    if metodo == 'QR':
        if not token:
            return Response({'detail': 'Falta token.'}, status=400)
        if not verify_qr_token(clase_id, token):
            return Response({'detail': 'Token inválido o expirado.'}, status=403)

    # Verificar que no haya asistencia previa
    if Asistencia.objects.filter(clase=clase, alumno=request.user).exists():
        return Response({'detail': 'Ya registraste asistencia a esta clase.'}, status=400)

    # Crear asistencia
    Asistencia.objects.create(
        clase=clase,
        alumno=request.user,
        metodo=metodo,
        timestamp=timezone.now()
    )

    return Response({'detail': 'Asistencia registrada exitosamente.'})