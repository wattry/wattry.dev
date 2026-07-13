import { useContext, useState } from "react";
import type { ReactElement, JSX } from "react";
import { styled } from '@mui/material/styles';
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { ReactTerminal, TerminalContext } from "react-terminal";

import { GlobeIcon } from "../GlobeLogo";

const Root = styled('div')(({ theme }) => ({
  fontFamily: 'Space Grotesk',
  width: '100%',
  maxWidth: "80%",
  height: '65vh',
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

const Prompt = () => <span>~/workspace/wattry.com on main <GlobeIcon role="img" aria-label="wattry logo" /></span>;
const color = 'linear-gradient(135deg, #2E6BFF 0%, #2E6BFF 20%, #7b2ff7 50%, #f107a3 80%, #f107a3 100%)';
const yellow = '#F5E13C';
const green = "#00FD61";

const defaultConfig = {
  themeBGColor: color,
  themeToolbarColor: "#131519",
  themeColor: yellow,
  themePromptColor: green,
};

type DefaultConfig = typeof defaultConfig;

interface Command {
  handler: (args: string[]) => ReactElement | Promise<ReactElement>,
  help: JSX.Element | (() => ReactElement)
}

const Message = (
  props: { input: string | Error }
) => {
  if (props.input instanceof Error) {
    return <Typography color="error" >{props.input.message}</Typography>;
  }

  if (typeof props.input === 'string') {
    return <Typography color="success">{props.input}</Typography>;
  }

  return <Message input={new Error('Unexpected error!')} />;
};

function Terminal() {
  const { } = useContext(TerminalContext);
  const [theme, setTheme] = useState<string>("wattry");
  const [prompt] = useState<string | ReactElement>(<Prompt />);
  const [history, setHistory] = useState<string[]>([]);
  const [config, setConfig] = useState<DefaultConfig>(defaultConfig);

  const record = (entry: string) => setHistory((prev) => [...prev, entry]);
  const style = { marginLeft: '10px' };
  const aboutContent = (
    <>
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
  );
  const skillsContent = <Typography>{skills.map((name: string) => <li>{name}</li>)}</Typography>;
  const contactContent = (
    <Typography>
      GitHub: <Link color="primary" underline="hover" href="https://github.com/wattry" target="_blank">https://github.com/wattry</Link><br />
      LinkedIn: <Link color="primary" underline="hover" href="https://www.linkedin.com/in/wattry" target="_blank">https://www.linkedin.com/in/wattry</Link>
    </Typography>
  );
  const defaultFiles: Record<string, ReactElement> = {
    'about.md': aboutContent,
    'skills.txt': skillsContent,
    'contact.md': contactContent,
  };
  const [files, setFiles] = useState<Record<string, ReactElement>>(defaultFiles);
  const handleHelp = (command: Command) => typeof command.help === 'function'
    ? command.help()
    : command.help;

  const commands: Record<string, Command> = {
    whoami: {
      handler() {
        return <Typography>wattry — Senior Software Engineer, Solutions Architect &amp; Team Leader</Typography>;
      },
      help: (<li><strong>whoami</strong> - Brief description.<br /></li>)
    },
    about: {
      handler() {
        return aboutContent;
      },
      help: (<li><strong>about</strong> - Who I am.<br /></li>)
    },
    skills: {
      handler() {
        return skillsContent;
      },
      help: (<li><strong>skills</strong> - What I can do.<br /></li>)
    },
    ls: {
      handler() {
        return <Typography>{Object.keys(files).map((name: string, i: number) => <li key={`file-${i}`}>{name}</li>)}</Typography>;
      },
      help: (<li><strong>ls</strong> - List files.<br /></li>)
    },
    pwd: {
      handler() {
        record('pwd');
        return <Typography>~/workspace/wattry.com</Typography>;
      },
      help: (<li><strong>pwd</strong> - Print working directory.<br /></li>)
    },
    cat: {
      handler(args) {
        const [file] = args;

        if (!file) {
          return <Message input={new Error("cat: missing file operand")} />;
        }

        if (file in files) {
          return <>{files[file]}</>;
        }

        return <Message input={new Error(`cat: ${file}: No such file or directory`)} />;
      },
      help: (<li><strong>cat &lt;file&gt;</strong> - Print a file's contents.<br /></li>)
    },
    touch: {
      handler(args) {
        const [name] = args;

        if (name) {
          setFiles((prev) => {
            return { ...prev, [name.trim().replace('./', '')]: <></> };
          });

          return <Message input={`${prompt} created`} />;
        }

        return <></>;
      },
      help: (<li><strong>help</strong> - Create a new empty file.<br /></li>)
    },
    rm: {
      handler(args) {
        if (args.length > 1) {
          const matches = Object.keys(files).filter((file) => {
            return args.find((name: string) => file.includes(name.trim().replace('./', '')));
          });

          if (matches.length) {
            setFiles((prev) => {
              const updated = { ...prev };
              for (const match of matches) {
                delete updated[match];
              }

              return updated;
            });

            return <Message input={`${matches.join(' ')} removed`} />;
          }

          return <></>;
        }

        const matches = Object.keys(files).filter((name) => {
          return name.includes(args.join(' ').replace('./', ''));
        });

        if (matches.length) {
          setFiles((prev) => {
            const updated = { ...prev };
            for (const match of matches) {
              delete updated[match];
            }

            return updated;
          });

          return <Message input={`${prompt} removed`} />;
        }

        return <></>
      },
      help: (<li><strong>rm</strong> - Delete a file.<br /></li>)
    },
    echo: {
      handler(args) {
        return <Typography>{args.join(' ').replaceAll("'", "").replaceAll('"', "")}</Typography>;
      },
      help: (<li><strong>echo &lt;text&gt;</strong> - Print text.<br /></li>)
    },
    date: {
      handler() {
        return <Typography>{new Date().toString()}</Typography>;
      },
      help: (<li><strong>date</strong> - Current date and time.<br /></li>)
    },
    history: {
      handler() {
        const entries = [...history, 'history'];
        return <Typography>{entries.map((entry, i) => <li key={i}>{`${i + 1}  ${entry}`}</li>)}</Typography>;
      },
      help: (<li><strong>echo &lt;text&gt;</strong> - Print text.<br /></li>)
    },
    theme: {
      handler() {
        return (<Typography>{themes.map((name: string) => <li>{name}</li>)}</Typography>);
      },
      help: (<>
        <li><strong>theme</strong> - Get the current theme.<br /></li>
        <strong style={style}>theme &lt;name&gt;</strong> - Changes the theme of the terminal.<br />
        <strong style={style}>theme list</strong> - List available themes.<br />
      </>)
    },
    config: {
      handler(args) {
        const [cmd, subCommand, value] = args;

        if (cmd === 'theme') {
          if (subCommand === 'list') {
            return <Typography>{themes.map((name: string) => <li>{name}</li>)}</Typography>;
          }
        }

        if (cmd === 'get') {
          if (subCommand === 'theme') {
            return <li>{theme}</li>;
          }

          const key = subCommand as keyof DefaultConfig;
          const value = defaultConfig[key];

          if (key && defaultConfig[key]) {
            return <li>{key}&#9;{value}</li>
          }

          return <Message input={new Error("config key required")} />;
        }

        if (cmd === 'set') {
          if (subCommand === 'theme' && typeof value === 'string') {
            if (themes.includes(value)) {
              setTheme(value);

              return <Message input={`theme\t\t${value} saved`} />;
            }

            return <Message input={new Error("Invalid theme!")} />;
          }

          const key = subCommand as keyof DefaultConfig;

          if (key && defaultConfig[key] && value && typeof value === 'string') {
            setConfig((prev) => ({ ...prev, [key]: value }));

            return <Message input={`${key}\t\t${value} saved`} />;
          }

          return <Message input={new Error("config key required")} />;
        }

        if (cmd === 'reset') {
          setTheme('wattry');
          setConfig(defaultConfig);

          return <Message input={`config reset`} />;
        }

        const keys = Object.entries(defaultConfig);

        return <Typography>{keys.map(([key, value]: string[]) => <li>{key}&#9;&#9;{value}</li>)}</Typography>;
      },
      help: (
        <>
          <li><strong>config</strong> - Manage individual theme config.<br /></li>
          <strong style={style}>config list</strong> - List config options.<br />
          <strong style={style}>config get &lt;name&gt;</strong> - Get config value by key.<br />
          <strong style={style}>config set &lt;name&gt; &lt;value&gt;</strong> - Set config value by key.<br />
          <strong style={style}>config theme list</strong> - List theme options.<br />
        </>
      )
    },
    fetch: {
      async handler() {
        try {
          const url = new URL(import.meta.env.VITE_CF_ENDPOINT)
          const res = await fetch(url);
          const json = await res.json();

          return <>
            Data: {json.data}<br />
            Status: {res.status} {res.statusText}<br />
            Headers: {Array.from(res.headers.entries().map(([key, value]) => `${key}: ${value}`)).join(', ')}
          </>
        } catch (e: unknown) {
          const error = e as Error;

          return <Message input={error} />
        }
      }, help: (
        <li><strong>fetch</strong> - Make an async request.<br /></li>
      )
    }
  };

  return (
    <Root>
      <ReactTerminal
        prompt={prompt}
        theme={theme}
        themes={{ "wattry": config }}
        welcomeMessage={<span>Type "help" for available commands.<br /></span>}
        defaultHandler={(command: string, args: string) => {
          record(`${command} ${args}`);

          if (command === 'help' || command === 'h') {
            return <>{Object.values(commands).map((command) => handleHelp(command))}</>;
          }

          const result = commands?.[command];

          if (result) {
            if (args.startsWith('help') || args.startsWith('-h') || args.startsWith('--help')) {
              return handleHelp(result);
            }

            return result.handler(args.split(' '));
          }

          return <>
            {`${command}: command not found`} <br />
          </>;
        }}
      />
    </Root>);
}

export default Terminal;
