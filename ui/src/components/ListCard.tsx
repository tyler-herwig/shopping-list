import React from 'react';
import { Card, CardContent, Typography, CardHeader, CardActions } from '@mui/material';

interface ListCardProps {
    title: string;
    description: string;
}

const ListCard: React.FC<ListCardProps> = ({ title, description }) => {
  return (
    <Card className="list-card">
      <CardHeader title={title} />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        
      </CardActions>
    </Card>
  );
};

export default ListCard;
