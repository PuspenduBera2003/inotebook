import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Button from '@mui/material/Button';
import EmailIcon from '@mui/icons-material/Email';
import imagePath from './image/iNotebook.jpg';
import devImagePath from './image/developer.jpg';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function About() {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const RedirectToMail = () => {
    window.location.href = 'mailto:puspendubera28@gmail.com';
  };

  return (
    <div className="container d-flex justify-content-center my-3">
      <Card sx={{ maxWidth: 600 }}>
        <CardHeader
          avatar={<Avatar alt="Puspendu Bera" src={devImagePath} />}
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title="Welcome to iNoteBook"
          subheader="September 14, 2023"
        />
        <CardMedia component="img" height="194" image={imagePath} alt="iNotebook" />
        <CardContent>
          <Typography variant="body2" color="text.secondary" style={{ textAlign: 'justify' }}>
            At iNoteBook, we believe in the power of organized and personalized note-taking. We understand that everyone has unique thoughts, ideas, and information that they want to capture and access conveniently. That's why we created this platform — to provide you with a seamless and secure way to store and access your notes, tailored specifically to your needs.
            Our mission is to empower individuals like you to stay organized, productive, and inspired. We believe that by providing a user-friendly interface and robust features, we can help you streamline your note-taking process and unlock your full potential.
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>
              <h5 className="card-title" style={{ fontWeight: 'bold' }}>Key Features:</h5>
            </Typography>
            <Typography paragraph style={{ textAlign: 'justify' }}>
              <b>1. Personalized Note Storage:</b> Our platform allows you to create and store notes in a secure and private space. Each user has their own dedicated area where they can effortlessly organize their thoughts, tasks, and important information.
            </Typography>
            <Typography paragraph style={{ textAlign: 'justify' }}>
              <b>2. Easy Accessibility:</b> We understand the importance of being able to access your notes anytime, anywhere. Whether you're using your computer, smartphone, or tablet, our website is fully responsive, ensuring a consistent and user-friendly experience across all devices.
            </Typography>
            <Typography paragraph style={{ textAlign: 'justify' }}>
              <b>3. Customization Options:</b> We believe that your note-taking experience should reflect your unique style and preferences. That's why we provide customization options, allowing you to personalize the appearance of your notes and create an environment that inspires you.
            </Typography>
            <Typography paragraph style={{ textAlign: 'justify' }}>
              <b>4. Privacy and Security:</b> We prioritize the privacy and security of your data. Your notes are stored securely, and we employ industry-standard encryption protocols to ensure that your information remains confidential and protected.
            </Typography>
            <Typography paragraph style={{ textAlign: 'justify' }}>
              We are a passionate team of developers who are committed to continuously improving and expanding our platform. We value your feedback and suggestions, as they help us enhance the user experience and add new features that truly meet your needs.
            </Typography>
            <Typography paragraph style={{ textAlign: 'justify' }}>
              Thank you for choosing I-NoteBook as your trusted note-taking companion. We're excited to be a part of your journey towards greater organization, productivity, and success.
            </Typography>
            <Typography paragraph style={{ textAlign: 'justify' }}>
              If you have any questions or need assistance, please don't hesitate to reach out to our support team. <em className="bg-dark p-1 rounded-1" style={{ fontWeight: 'bold', color: 'white' }}>Happy note-taking!</em>
            </Typography>
          </CardContent>
          <div className="container d-flex justify-content-center mb-2">
            <Button variant="contained" startIcon={<EmailIcon />} onClick={RedirectToMail}>
              Send
            </Button>
          </div>
        </Collapse>
      </Card>
    </div>
  );
}