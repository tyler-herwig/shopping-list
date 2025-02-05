import React from 'react';
import { Card, CardContent, Typography, CardHeader, CardActions, Button } from '@mui/material';

interface ListCardProps {
    title: string;
    description: string;
}

const ListCard: React.FC<ListCardProps> = ({ title, description }) => {
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
};

export default ListCard;
