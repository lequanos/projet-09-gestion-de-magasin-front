import { Card, CardHeader, CardContent, Typography } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

// Types
type DashboardCardProps = {
  title: string;
  evolution: number;
  active: number;
  total: number;
};

function DashboardCard({
  title,
  evolution = 10,
  active,
  total,
}: DashboardCardProps) {
  // Hooks
  const { t } = useTranslation('translation');

  // Methods
  /**
   * Get the evolution text and color based on the number
   */
  const getEvolutionText = () => {
    return (
      <Typography
        variant="subtitle1"
        color={evolution > 0 ? 'success.main' : 'error.main'}
      >
        {evolution > 0 ? `+${evolution}` : evolution}%{' '}
        {evolution > 0 ? (
          <ArrowUpward color="success" fontSize="small" />
        ) : (
          <ArrowDownward color="error" fontSize="small" />
        )}
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
