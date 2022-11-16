import { Tab } from '@mui/material';
import { Link } from 'react-router-dom';

function LinkTab(props: { [key: string]: any }) {
  return <Tab component={Link} to={props.pathname} {...props} />;
}

export default LinkTab;
