import './Home.scss';
import logo from '../../assets/logo.svg';
import RSInputText from '../../components/RSInputText';
import RSForm from '../../components/RSForm';
import { Typography, Divider } from '@mui/material';
import { useState } from 'react';
import RSButton from '../../components/RSButton';

function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="home">
      <div className="home--app">
        <img src={logo} className="home--app-picture" />
      </div>
      <div className="home--login">
        <RSForm className="home--login-form">
          <Typography align="center" className="home--login-title">
            Se connecter
          </Typography>
          <RSInputText
            label="Email"
            type="email"
            value={email}
            setValue={setEmail}
          />
          <RSInputText
            label="Password"
            type="password"
            value={password}
            setValue={setPassword}
          />
          <RSButton>Se connecter</RSButton>
          <Divider
            sx={{
              margin: '2rem 0',
              borderColor: 'primary.main',
              fontFamily: 'Roboto',
              color: 'primary.main',
              borderWidth: 1,
              '&.MuiDivider-root::before': {
                borderColor: 'primary.main',
              },
              '&.MuiDivider-root::after': {
                borderColor: 'primary.main',
              },
            }}
          >
            OU
          </Divider>
        </RSForm>
      </div>
    </div>
  );
}

export default Home;
