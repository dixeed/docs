// Import React
import React from 'react';
// Import Spectacle Core tags
import {
  Appear,
  Deck,
  Fill,
  Heading,
  Image,
  Layout,
  List,
  ListItem,
  S,
  Slide,
  Text,
} from 'spectacle';
// Import theme
import createTheme from 'spectacle/lib/themes/default';
import baseExample from '../assets/svg/base-example.svg';
import whyImage from '../assets/why-rebase.jpg';

// Require CSS
require('normalize.css');

const theme = createTheme(
  {
    primary: 'white',
    secondary: '#dd7a3a',
    tertiary: 'black',
    // quaternary: "#CECECE"
  },
  {
    primary: 'Montserrat',
    secondary: 'Helvetica',
  },
);

export default class Presentation extends React.Component {
  render() {
    return (
      <Deck transition={['fade']} transitionDuration={500} theme={theme}>
        <Slide bgColor="secondary">
          <Heading size={1} fit caps lineHeight={1} textColor="primary">
            Dixeed
          </Heading>
          <Text margin="10px 0 0" textColor="tertiary" size={1} fit bold>
            Git rebase training
          </Text>
        </Slide>
        <Slide bgColor="secondary">
          <Heading margin="0 0 50px 0" size={1} textColor="primary">
            Why rebase?
          </Heading>
          <Appear transitionDuration={500}>
            <Image src={whyImage} />
          </Appear>
        </Slide>
        <Slide>
          <Text margin="30px 0" size={6} textColor="tertiary">
            In <S type="bold">GIT</S> has 2 ways of integrating changes from one branch to another.
          </Text>
          <Appear transitionDuration={500}>
            <Text margin="30px 0" textColor="tertiary" size={2}>
              Idea?
            </Text>
          </Appear>
          <Layout>
            <Fill>
              <Appear transitionDuration={500}>
                <Text caps bold textColor="secondary">
                  Merge
                </Text>
              </Appear>
            </Fill>
            <Fill>
              <Appear transitionDuration={500}>
                <Text caps bold textColor="secondary">
                  Rebase
                </Text>
              </Appear>
            </Fill>
          </Layout>
        </Slide>
        <Slide bgColor="secondary" textColor="primary">
          <Heading margin="0 0 50px 0" size={3} textColor="tertiary" caps>
            Just a reminder
          </Heading>
          <List>
            <Appear transitionDuration={500}>
              <ListItem>Branches are just pointers</ListItem>
            </Appear>
            <Appear transitionDuration={500}>
              <ListItem>Each commit is linked to its predecessor</ListItem>
            </Appear>
            <Appear transitionDuration={500}>
              <ListItem>Commit are identified by a hash</ListItem>
            </Appear>
          </List>
        </Slide>
        <Slide bgColor="primary" textColor="tertiary">
          <Heading margin="50px 0" size={3} textColor="secondary">
            Base example
          </Heading>
          <Image width="80%" src={baseExample} />
        </Slide>
        <Slide bgColor="primary" textColor="tertiary">
          <Heading margin="50px 0" size={3} textColor="secondary">
            Merge: Fast-forward
          </Heading>
          <Layout>
            <Fill>
              <Image src="" />
            </Fill>
            <Fit />
            <Fill />
          </Layout>
        </Slide>
      </Deck>
    );
  }
}
