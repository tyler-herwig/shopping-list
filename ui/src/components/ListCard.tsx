import React from "react";
import { Card, Typography, Box, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import { MoreHoriz } from "@mui/icons-material"; // Add icons

interface ListCardProps {
  title: string;
  description: string;
  count: number;
}

// Styled Card with a gradient background, icons, and 2 simple circles for overlay
const StyledCard = styled(Card)({
  height: "150px",
  position: "relative",
  color: "white",
  borderRadius: "16px",
  boxShadow: "3px 3px 10px rgba(0,0,0,0.1)",
  overflow: "hidden",
  background: "linear-gradient(135deg, #6a1b9a 30%, #8e24aa 100%)",
  display: "flex",
  alignItems: "center",
  padding: "16px",
  justifyContent: "space-between",
  "::before": {
    content: '""',
    position: "absolute",
    width: "270px",
    height: "270px",
    background: "rgba(255, 255, 255, 0.1)", // Faint overlay for visual interest
    top: "-140px",
    right: "-90px",
    borderRadius: "50%",
  }
});

const ListCard: React.FC<ListCardProps> = ({ title, description, count }) => {
  return (
    <StyledCard>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: "bold"}}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)"}}>
          {description}
        </Typography>
  
      </Box>
      <Box sx={{
        position: "absolute", 
        top: 8, 
        right: 8, 
        background: "rgba(0, 0, 0, 0.4)", // Dark background for the box
        borderRadius: "12px", 
        padding: "2px", 
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <IconButton sx={{ color: "white" }}>
          <MoreHoriz />
        </IconButton>
      </Box>
      <Box>
          <Typography variant="h3" sx={{ fontWeight: "bold", marginRight: 8 }}>
            {count}
          </Typography>
      </Box>
    </StyledCard>
  );
};

export default ListCard;