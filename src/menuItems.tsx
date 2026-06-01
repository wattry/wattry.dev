import { JSX } from 'react';
import {
  ShortText,
  DoneAll,
  Highlight,
  Work,
  History as HistoryIcon,
  Alarm,
  School,
} from '@mui/icons-material';

import { Menu } from './interfaces/menu.interface';
import { History } from './interfaces/history.interface';
import List from './components/Content/List'
import HistoryComponent from './components/Content/History';
import SkillsTable from './components/Content/SkillsTable';

const MenuItems: Menu[] = [
  {
    title: 'Summary',
    content: [
      `A motivated senior software engineer & business analyst, driven by finding creative solutions to complex problems in an Agile environment. A career working across several industries namely finance, accounting, insurance, & networking. Designed and deployed infrastructure in AWS, using IaC, to enable customer engagement with high quality UIs, across frontend frameworks. Written, maintained, and documented extensive RESTful APIs and SDKs to integrate with customer requirements and external systems. Delivering data from relational and NoSQL databases. Integrating CICD to build, test and deploy applications, APIs, and packages.`,
    ],
    component: (content: string[]): JSX.Element => <List paragraphs={content} />,
    icon: <ShortText />,
  },
  {
    title: 'Skills and Experience',
    content: [
      'Amazon Web Services and Google Cloud Platform',
      'Terraform, AWS Cloudformation & SAM',
      'Sprint (Scrum), Kanban',
      'Node.js, JavaScript ES6+, TypeScript, Rust',
      'Express, Axios, Sequelize, Jest and more',
      'Java, C# and Python (less recent)',
      'React, Bootstrap, jQuery, Ionic',
      'REST, GraphQL & LDAP',
      'SQL with Postgres and Oracle, DynamoDB, & MongoDB.',
      'Docker, Kubernetes & Helm',
      'Gitlab CICD and GitHub actions',
      'Robot & Playwrite E2E testing frameworks',
    ],
    component: (content: string[]): JSX.Element => <SkillsTable skills={content} />,
    icon: <DoneAll />,
  },
  {
    title: 'Experience',
    icon: <Work />,
    subMenus: [
      {
        title: 'Highlights',
        content: [
          `Our most senior AWS expert unfortunately had to unexpectedly resign, at about the same time I was given the opportunity to attend a SANS course. We had largely managed our infrastructure using CloudFormation. After I had attended SANS, we decided to shift to Terraform, fortunately the SANS course had covered best practices, with Terraform examples, so I was equipped apply this knowledge to our new Terraform project while drastically reducing our need for AWS resources managed by our team. This allowed our developers to quickly pivot and focus on other tasks while the new CICD pipeline was created. This pipeline is drastically faster and less complex than the prior AWS managed pipelines.`,
          `In early 2019 our team was selected to be part of a cross organizational effort to abstract our On premises cloud infrastructure. By designing an application that would provision virtual machines to facilitate our advanced research computing department effort to make big data analysis easier. A Sprint team was organized and I was set to develop the frontend component of the system. The team formed quickly and was able to conclude the project well ahead of schedule. We were also faced with the challenge of a change of scope midway through the project. This resulted in me being heavily involved in working with backend provisioning systems that were well outside of my scope. This allowed me to engage in skills such as OpenStack resource provisioning using Ansible and Ansible Tower. The project was successful and we were able to deliver two systems which had been promised for several years.`,
          'Since mid 2019 my team has been tasked with consolidating, client facing, legacy systems into a single Web application written in node.js and React. This coincided with a desire, from higher management, to shift from OnPrem resources to AWS hosted resources. I was deeply involved in the both the frontend design decisions and the evolving architecture of the infrastructure required for this initiative. Through this process we deployed applications and services using CloudFormation and Terraform hooked into CICD pipelines to automate deployments.',
        ],
        component: (content: string[]) => <List paragraphs={content} />,
        icon: <Highlight />,
      },
      {
        title: 'History',
        content: [
          {
            employer:
              'Virginia Tech – Senior Software Engineer       02/2015 - 07/2017',
            description:
              'NI&S is a division within the Department of IT that provides networking and network infrastructure services to Virginia Tech',
            summary: [
              'Contributed to existing internal web applications providing networking and billing tools.',
              'Collaborated with UX team to build web application which provisioned OnPrem virtual machines to empower researchers.',
              'Maintained AWS infrastructure using AWS Cloudformation and SAM.',
              'Designed a GitLab CICD pipeline to automate deployment of feature branches, development, and production instances.',
              'Incorporated testing frameworks into CICD pipelines to automate testing before code enters long living branches.',
              'Involved in driving Sprints to ensure longevity of applications and code bases.',
              'Lead daily scrums and co-ordinates developers and stakeholders',
              'Involved in mentoring and training new hires and interns',
            ]
          }
        ],
        component: (content: History[]): JSX.Element => <HistoryComponent history={content} />,
        icon: <HistoryIcon />,
      },
      {
        title: 'Early Career',
        icon: <Alarm />,
        content: [
          {
            employer: 'MIP Holdings - Junior Software Developer     02/2015 - 07/2017',
            description:
              'A financial information systems development company, with one of the biggest client bases on the African continent. Specializing in insurance and financial organizations.',
            summary: [
              'In 2014 I was selected to be trained to take over the development of an in-house web UI accounting package that was being pushed for live release.',
              'The goal was to be able to assist the currently over-committed senior developer with the plan of succession. ',
              'I attended a 3-month training program and was certified as an OpenEdge Progress 4GL software developer.',
              'We were, at that time, using Waterfall methodology and transitioned to Agile methodology over a 6-month period.',
            ]
          },
        ],
        component: (content: any): JSX.Element => <HistoryComponent history={content} />,
      },
    ],
  },
  {
    title: 'Education & Continued',
    content: [
      'Bachelor of Commerce Honors, Stellenbosch University (2015)',
      'Bachelor of Commerce, Stellenbosch University (2013)',
      'The React Bootcamp (2019)',
      'Cyber Threat Hunting w/ Chris Brenton (2020)',
      'SANS SEC510 (38 CPE credits) (2021)'

    ],
    component: (content: string[]): JSX.Element => <List paragraphs={content} />,
    icon: <School />,
  },
];

export default MenuItems;