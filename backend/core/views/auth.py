from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from core.models import Perfil

from google.oauth2 import id_token
from google.auth.transport import requests as grequests
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    credential = request.data.get('credential')
    if not credential:
        return Response({'detail': 'Falta credential.'}, status=400)

    try:
        info = id_token.verify_oauth2_token(
            credential,
            grequests.Request(),
            settings.GOOGLE_CLIENT_ID
        )

        if not info.get('email_verified'):
            return Response({'detail': 'Email no verificado por Google.'}, status=401)

        email = info['email'].lower()
        
        # Validación de dominio comentada para permitir cualquier email
        # domain = email.split('@')[-1]
        # if settings.ALLOWED_EMAIL_DOMAINS and domain not in settings.ALLOWED_EMAIL_DOMAINS:
        #     return Response(
        #         {'detail': f'Dominio no permitido: {domain}.'},
        #         status=403
        #     )

        first_name = info.get('given_name') or ''
        last_name = info.get('family_name') or ''

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email,
                'first_name': first_name,
                'last_name': last_name,
            }
        )

        # Crear perfil si no existe
        perfil, _ = Perfil.objects.get_or_create(
            user=user,
            defaults={'rol': 'DOCENTE'}
        )

        # Generar tokens JWT
        refresh = RefreshToken.for_user(user)

        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'rol': perfil.rol,
            }
        })

    except ValueError as e:
        return Response({'detail': f'Token inválido: {str(e)}'}, status=401)