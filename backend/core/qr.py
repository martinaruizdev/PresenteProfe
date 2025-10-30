from django.core.signing import TimestampSigner, SignatureExpired, BadSignature

_signer = TimestampSigner(salt='aula.qr')
 
QR_TTL_SECONDS = 60
 
def make_qr_token(clase_id: int)-> str:
    return _signer.sign(str(clase_id))

def verify_qr_token(token: str, clase_id: int, max_age: int = QR_TTL_SECONDS)-> bool:
    try:
        value = _signer.unsign(token, max_age=max_age)
        return value == str(clase_id)
    except (SignatureExpired, BadSignature):
        return False