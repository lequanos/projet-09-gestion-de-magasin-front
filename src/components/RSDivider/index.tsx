import { Divider } from '@mui/material';

type RSDividerProps = {
  children: string | string[];
};

function RSDivider({ children }: RSDividerProps) {
  return (
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
      {children}
    </Divider>
  );
}

export default RSDivider;
