import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  username: string;
};


export const Header = ({ username }: HeaderProps) => {
  
  const navigate = useNavigate()
  const handleAnalyticsClick = () => {
    navigate(`/analytics/${username}`);
  };

  return (
    <AppBar position="static" sx={{ mb: 12 }}>
      <Toolbar>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          Titan App
        </Typography>
        <Typography>
        {username && (
          <Button color="inherit" onClick={handleAnalyticsClick}>
            Analytics
          </Button>
        )}
        </Typography>
        <Button color="inherit">
          {username && username}
          {!username && (
            <Link href="/login" color="inherit" underline="none">
              Login
            </Link>
          )}
        </Button>
      </Toolbar>
    </AppBar>
  );
};
