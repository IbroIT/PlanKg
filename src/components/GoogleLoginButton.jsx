import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from '../api/axios';
import { setAuthTokens } from '../api/auth';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function GoogleLoginButton({ onSuccess, onError }) {
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('/auth/google/', {
        access_token: credentialResponse.credential,
        id_token: credentialResponse.credential,
      });

      if (response.data.access && response.data.refresh) {
        setAuthTokens(response.data.access, response.data.refresh);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        if (onSuccess) {
          onSuccess(response.data);
        } else {
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error('Google login error:', error);
      if (onError) {
        onError(error);
      } else {
        alert('Ошибка при входе через Google. Попробуйте еще раз.');
      }
    }
  };

  const handleGoogleError = () => {
    console.error('Google Login Failed');
    if (onError) {
      onError(new Error('Google Login Failed'));
    }
  };

  if (!GOOGLE_CLIENT_ID) {
    console.warn('VITE_GOOGLE_CLIENT_ID is not set in .env file');
    return null;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="w-full">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          text="continue_with"
          shape="rectangular"
          size="large"
          locale="ru"
          width="100%"
          theme="filled_blue"
        />
      </div>
    </GoogleOAuthProvider>
  );
}

export default GoogleLoginButton;