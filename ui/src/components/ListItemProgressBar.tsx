import { Box, LinearProgress, Typography } from "@mui/material"

interface ListItemProgressBarProps {
    completedItems: number | undefined;
    totalItems: number | undefined;
}

const ListItemProgressBar: React.FC<ListItemProgressBarProps> = ({ completedItems, totalItems }) => {

    const completionPercentage = totalItems ? ((completedItems || 0) / totalItems) * 100 : 0;

    return (
        <Box sx={{ width: "100%", marginTop: 2 }}>
          <LinearProgress
            variant="determinate"
            value={completionPercentage}
            sx={{ height: 6, borderRadius: 2 }}
          />
          <Typography variant="body2" sx={{ textAlign: "right", marginTop: 1 }}>
            {completedItems}/{totalItems}
          </Typography>
        </Box>
    )
};

export default ListItemProgressBar;