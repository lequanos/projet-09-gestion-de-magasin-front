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
        fontWeight: 'bold',
        borderWidth: 1,
        '&.MuiDivider-root::before': {
          borderColor: 'primary.main',
          borderWidth: 2,
          transform: 'translateY(calc(50% - 2px))',
        },
        '&.MuiDivider-root::after': {
          borderColor: 'primary.main',
          borderWidth: 2,
          transform: 'translateY(calc(50% - 2px))',
        },
      }}
    >
      {children}
    </Divider>
  );
}

export default RSDivider;
