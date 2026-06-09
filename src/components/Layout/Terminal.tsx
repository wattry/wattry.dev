import { useContext, useState } from "react";
import type { ReactElement } from "react";
import { styled } from '@mui/material/styles';
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { ReactTerminal, TerminalContext } from "react-terminal";

import { GlobeIcon } from "../GlobeLogo";

const Root = styled('div')(({ theme }) => ({
  fontFamily: 'Space Grotesk',
  width: '100%',
  maxWidth: "80%",
  height: '70vh',
  margin: '0 auto',                 // centers → even side margins
  marginBottom: theme.spacing(4),   // breathing room from Main / Footer
  padding: theme.spacing(1),
  boxSizing: 'border-box',
}));

const themes = [
  "wattry",
  "light",
  "dark",
  "material-light",
  "material-dark",
  "material-ocean",
  "matrix",
  "dracula",
];

const skills = [
  'Amazon Web Services(AWS) and Google Cloud Platform(GCP)',
  'Terraform, CloudFormation & SAM',
  'Development lifecycle(collaborative management / Agile), Sprint & Kanban',
  'Node JS',
  'CommonJS and ESM dual - deployment experience',
  'TypeScript',
  'Rust',
  'Express, Axios, Sequelize, Prisma, Jest, Vitest',
  'React, Bootstrap, jQuery, Ionic, Material UI',
  'RBAC, ReBAC & Identity',
  'REST, GraphQL & LDAP',
  'Postgres, Oracle and DynamoDB',
  'Docker, Kubernetes & Helm',
  'CI/CD',
  'Playwright E2E & Robot testing frameworks',
  'HashiCorp Vault'
];

export const Lambda = () => <span style={{ color: '#FB7E14' }}>λ</span>;
const Prompt = () => <span>~/workspace/wattry.dev on main <GlobeIcon role="img" aria-label="wattry logo" /></span>;

function Terminal() {
  const { } = useContext(TerminalContext);
  const [theme, setTheme] = useState<string>("wattry");
  const [prompt] = useState<string | ReactElement>(<Prompt />);
  const help = (
    <span>
      <strong>clear</strong> - clears the console. <br />
      <strong>theme</strong> - Get the current theme.<br />
      <strong style={{ marginLeft: '10px' }}>theme &lt;name&gt;</strong> - Changes the theme of the terminal.<br />
      <strong style={{ marginLeft: '10px' }}>theme list</strong> - List available themes.<br />
      <strong>about</strong> - Who I am.<br />
      <strong>skills</strong> - What I can do.<br />
    </span>
  );

  const commands = {
    help: help,
    h: help,

    whoami: (<>
    </>),

    about: () => {
      return <>
        <Link
          color="primary"
          underline="hover"
          href="https://github.com/wattry"
          target="_blank">https://github.com/wattry
        </Link><br />
        <img src="https://ghchart.rshah.org/wattry" alt="wattry's Github Chart" /><br />
        <Typography >A committed and motivated senior software engineer, solutions architect and team leader, driven to promote a collaborative approach to creative solutions for complex business problems in an iterative development environment. With a track record of contributing to open source projects and mentoring to ensure exceptional software that solves real business challenges.</Typography><br />
        <Typography >Has a proven track record of maintaining high standards through high-quality, thoroughly tested code using mechanisms such as pull requests and merge requests to ensure collaboration.</Typography><br />
        <Typography >A career spanning several industries — namely finance, accounting, insurance, energy & networking. Expertise in designing and deploying AWS/GCP infrastructure using CI/CD pipelines to deliver on key business objectives. Collaborated with customers and internal teams to deliver quality UIs and APIs.</Typography><br />
      </>
    },

    skills: () => {
      return <Typography>{skills.map((name: string) => <li>{name}</li>)}</Typography>
    },

    theme: (prompt: string) => {
      const [cmd]: string[] = prompt.split(' ');

      if (cmd === 'list') {
        return <Typography>{themes.map((name: string) => <li>{name}</li>)}</Typography>
      }

      if (cmd) {
        if (themes.includes(cmd)) {
          return setTheme(cmd);
        }

        return <Typography color="error">Invalid theme!</Typography>;
      }

      return <Typography>{theme}</Typography>;
    },
  };

  return (
    <Root>
      <ReactTerminal
        prompt={prompt}
        theme={theme}
        themes={{
          "wattry": {
            themeBGColor: "#022833",
            themeToolbarColor: "#131519",
            themeColor: "#00FD61",
            themePromptColor: "#00FD61",
          }
        }}
        welcomeMessage={<span>Type "help" for available commands.<br /></span>}
        commands={commands}
        defaultHandler={(command: string, commandArguments: string[]) => {
          return <>
            <br />{`${command} not found.`} <br /><br />
            {help}
          </>;
        }}
      />
    </Root>);
}

export default Terminal;