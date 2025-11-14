from django.conf import settings
from urllib.parse import quote
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.models import Clase
from core.qr import make_qr_token
from api.permissions import IsDocente  # o algún permiso que uses para el profe
from core.qr import QR_TTL_SECONDS

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsDocente])  # Solo docentes pueden generar QR
def generar_qr(request, clase_id):
    try:
        clase = Clase.objects.get(pk=clase_id)
    except Clase.DoesNotExist:
        return Response({'detail': 'Clase no encontrada.'}, status=404)

    token = make_qr_token(clase.id)
    checkin_url = f"{settings.FRONTEND_BASE_URL}/checkin?clase_id={clase.id}&token={quote(token)}"

    return Response({
        'token': token,
        'expires_in': QR_TTL_SECONDS,
        'checkin_url': checkin_url
    })
