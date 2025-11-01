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
        domain = email.split('@')[-1]

        if domain not in settings.ALLOWED_EMAIL_DOMAINS:
            return Response(
                {'detail': f'Dominio no permitido: {domain}. Solo @tufacu.edu.ar.'},
                status=403
            )

        first_name = info.get('given_name') or ''
        last_name = info.get('family_name') or ''

        user, _ = User.objects.get_or_create(
            username=email,
            defaults={
                'email': email,
                'first_name': first_name,
                'last_name': last_name
            }
        )

        Perfil.objects.get_or_create(user=user, defaults={'rol': 'ALUMNO'})
        refresh = RefreshToken.for_user(user)

        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        })

    except ValueError:
        return Response({'detail': 'ID Token inválido.'}, status=401)