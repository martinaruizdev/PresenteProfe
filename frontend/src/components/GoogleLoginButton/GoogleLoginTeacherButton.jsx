import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export default function GoogleLoginTeacherButton({ onLogin }) {
  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE}/api/auth/google-teacher/`,
        {
          credential: credentialResponse.credential,
        }
      );

      const { access, refresh, user } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));

      onLogin(user);
    } catch (error) {
      console.error('Error en login de profesor:', error);
      alert('Error al iniciar sesión como profesor');
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log('Login Failed')}
      useOneTap={false}
      text="continue_with"
      shape="rectangular"
      theme="outline"
      size="large"
      width="100%"
    />
  );
}