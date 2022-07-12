import {BACKEND_URL} from '../api.js';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // function login()

  return (
    <form action={`${BACKEND_URL}/auth/login`} method="post">
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          className="border"
        />
      </div>
      <div>
        <label htmlFor="current-password">Password</label>
        <input
          id="current-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="border"
        />
      </div>
      <div>
        <button type="submit" className="pt-1 pb-1.5 bg-blue-300">
          Log in
        </button>
      </div>
    </form>
  );
}
