import { Card, CardHeader, CardContent, Typography } from '@mui/material';
import {
  ArrowUpward,
  ArrowDownward,
  HorizontalRule,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { ReactElement } from 'react';

// Types
type DashboardCardProps = {
  title: string;
  evolution?: number;
  active?: number;
  total?: number;
};

function DashboardCard({
  title,
  evolution,
  active,
  total,
}: DashboardCardProps) {
  // Hooks
  const { t } = useTranslation('translation');

  // Methods
  /**
   * Get evolution text elements
   */
  const getEvolutionTextElements = () => {
    let color: string;
    let text: string;
    let icon: ReactElement<any, any>;

    switch (true) {
      case evolution && evolution > 0:
        color = 'success.main';
        text = `+${evolution}`;
        icon = <ArrowUpward color="success" fontSize="small" />;
        break;
      case evolution && evolution < 0:
        color = 'error.main';
        text = `${evolution}`;
        icon = <ArrowDownward color="error" fontSize="small" />;
        break;
      default:
        color = 'primary.main';
        text = `${evolution}`;
        icon = <HorizontalRule color="primary" fontSize="small" />;
    }

    return {
      color,
      text,
      icon,
    };
  };
  /**
   * Get the evolution text and color based on the number
   */
  const getEvolutionText = () => {
    const { color, text, icon } = getEvolutionTextElements();
    return (
      <Typography variant="subtitle1" color={color}>
        {text}% {icon}
      </Typography>
    );
  };

  return (
    <Card className="dashboard--card">
      <CardHeader action={getEvolutionText()} />
      <CardContent className="dashboard--card-content">
        <div>
          <Typography component={'span'} variant="h3">
            {active}
          </Typography>
          <Typography component={'span'} variant="h6">
            /{total}
          </Typography>
        </div>
        <Typography variant="subtitle1" color="primary.main">
          {t(title)}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default DashboardCard;
